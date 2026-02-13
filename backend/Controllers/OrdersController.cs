using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using RestorAPP.Backend.Data;
using RestorAPP.Backend.DTOs;
using RestorAPP.Backend.Models;
using System.Security.Claims;

namespace RestorAPP.Backend.Controllers;

[Route("api/[controller]")]
[ApiController]
[Authorize]
public class OrdersController : ControllerBase
{
    private readonly AppDbContext _context;

    public OrdersController(AppDbContext context)
    {
        _context = context;
    }

    // GET: api/orders (User: My Orders, Admin: All Orders)
    [HttpGet]
    public async Task<ActionResult<IEnumerable<Order>>> GetOrders()
    {
        var role = User.FindFirstValue(ClaimTypes.Role);
        var userIdString = User.FindFirstValue(ClaimTypes.NameIdentifier);

        if (!int.TryParse(userIdString, out int userId))
        {
            return Unauthorized();
        }

        IQueryable<Order> query = _context.Orders
            .Include(o => o.OrderItems)
            .ThenInclude(oi => oi.Product)
            .Include(o => o.User); // Load user info

        if (role == Role.Admin.ToString())
        {
            return await query.OrderByDescending(o => o.CreatedAt).ToListAsync();
        }
        else
        {
            return await query
                .Where(o => o.UserId == userId)
                .OrderByDescending(o => o.CreatedAt)
                .ToListAsync();
        }
    }

    // GET: api/orders/{id}
    [HttpGet("{id}")]
    public async Task<ActionResult<Order>> GetOrder(int id)
    {
        var role = User.FindFirstValue(ClaimTypes.Role);
        var userIdString = User.FindFirstValue(ClaimTypes.NameIdentifier);

        if (!int.TryParse(userIdString, out int userId))
        {
            return Unauthorized();
        }

        var order = await _context.Orders
            .Include(o => o.OrderItems)
            .ThenInclude(oi => oi.Product)
            .Include(o => o.User)
            .FirstOrDefaultAsync(o => o.Id == id);

        if (order == null)
        {
            return NotFound();
        }

        // Check verification (Admin sees all, User sees own)
        if (role != Role.Admin.ToString() && order.UserId != userId)
        {
            return Forbid();
        }

        return order;
    }

    // POST: api/orders (Create Order)
    [HttpPost]
    public async Task<ActionResult<Order>> CreateOrder(CreateOrderDto request)
    {
        var userIdString = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (!int.TryParse(userIdString, out int userId))
        {
            return Unauthorized();
        }

        // Rule: ADMIN does not create orders
        if (User.IsInRole(Role.Admin.ToString()))
        {
            return Forbid();
        }

        if (request.Items == null || !request.Items.Any())
        {
            return BadRequest("Order must contain items.");
        }

        using var transaction = await _context.Database.BeginTransactionAsync();
        try
        {
            var order = new Order
            {
                UserId = userId,
                Status = OrderStatus.Pending,
                CreatedAt = DateTime.UtcNow,
                OrderItems = new List<OrderItem>()
            };

            decimal grandTotal = 0;

            foreach (var item in request.Items)
            {
                var product = await _context.Products.FindAsync(item.ProductId);
                if (product == null)
                {
                    await transaction.RollbackAsync();
                    return BadRequest($"Product ID {item.ProductId} not found.");
                }

                if (!product.IsActive)
                {
                    await transaction.RollbackAsync();
                    return BadRequest($"Product {product.Name} is not available.");
                }

                if (product.Stock < item.Quantity)
                {
                    await transaction.RollbackAsync();
                    return BadRequest($"Insufficient stock for {product.Name}. Available: {product.Stock}");
                }

                // Decrement stock
                product.Stock -= item.Quantity;

                // Create OrderItem
                var orderItem = new OrderItem
                {
                    ProductId = product.Id,
                    Quantity = item.Quantity,
                    Price = product.Price // Snapshot price
                };

                order.OrderItems.Add(orderItem);
                grandTotal += orderItem.Quantity * orderItem.Price;
            }

            order.Total = grandTotal;

            _context.Orders.Add(order);
            await _context.SaveChangesAsync();
            await transaction.CommitAsync();

            return CreatedAtAction(nameof(GetOrders), new { id = order.Id }, order);
        }
        catch (Exception ex)
        {
            await transaction.RollbackAsync();
            return StatusCode(500, $"Internal server error: {ex.Message}");
        }
    }

    // PUT: api/orders/{id}/status (Admin Only)
    [HttpPut("{id}/status")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> UpdateStatus(int id, [FromBody] UpdateOrderStatusDto dto)
    {
        if (!Enum.TryParse<OrderStatus>(dto.Status, true, out var status))
        {
            return BadRequest("Invalid status value.");
        }

        var order = await _context.Orders.FindAsync(id);
        if (order == null)
        {
            return NotFound();
        }

        order.Status = status;
        await _context.SaveChangesAsync();

        return Ok(order);
    }

    // PUT: api/orders/{id}/cancel (User Only - Logic: Active PENDING)
    [HttpPut("{id}/cancel")]
    public async Task<IActionResult> CancelOrder(int id)
    {
        var userIdString = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (!int.TryParse(userIdString, out int userId)) return Unauthorized();

        var order = await _context.Orders.FindAsync(id);
        if (order == null) return NotFound();

        // Check ownership (unless admin, but requirement says User cancels)
        if (order.UserId != userId)
        {
            return Forbid();
        }

        if (order.Status != OrderStatus.Pending)
        {
            return BadRequest("Only pending orders can be cancelled.");
        }

        order.Status = OrderStatus.Cancelled;

        // Optional: Should we restore stock? Requirement didn't create rule for this explicitly, 
        // but logical for canceled orders to release stock. I'll implement it for robustness.
        var items = await _context.OrderItems
            .Include(oi => oi.Product)
            .Where(oi => oi.OrderId == id)
            .ToListAsync();

        foreach (var item in items)
        {
            if (item.Product != null)
            {
                item.Product.Stock += item.Quantity;
            }
        }

        await _context.SaveChangesAsync();
        return Ok(new { message = "Order cancelled successfully." });
    }
}
