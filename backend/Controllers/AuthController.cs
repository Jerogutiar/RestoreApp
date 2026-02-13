using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using RestorAPP.Backend.Data;
using RestorAPP.Backend.DTOs;
using RestorAPP.Backend.Models;
using RestorAPP.Backend.Services;

namespace RestorAPP.Backend.Controllers;

[Route("api/[controller]")]
[ApiController]
public class AuthController : ControllerBase
{
    private readonly AppDbContext _context;
    private readonly TokenService _tokenService;

    public AuthController(AppDbContext context, TokenService tokenService)
    {
        _context = context;
        _tokenService = tokenService;
    }

    [HttpPost("register")]
    public async Task<ActionResult> Register(RegisterDto request)
    {
        if (await _context.Users.AnyAsync(u => u.Email == request.Email))
        {
            return BadRequest(new { message = "Email already exists." });
        }

        var user = new User
        {
            Name = request.Name,
            Email = request.Email,
            PasswordHash = BCrypt.Net.BCrypt.HashPassword(request.Password),
            Role = Role.User
        };

        _context.Users.Add(user);
        await _context.SaveChangesAsync();

        var token = _tokenService.CreateToken(user);
        return Ok(new
        {
            token,
            user = new { user.Id, user.Name, user.Email, Role = user.Role.ToString() }
        });
    }

    [HttpPost("login")]
    public async Task<ActionResult> Login(LoginDto request)
    {
        var user = await _context.Users.FirstOrDefaultAsync(u => u.Email == request.Email);

        if (user == null || !BCrypt.Net.BCrypt.Verify(request.Password, user.PasswordHash))
        {
            return BadRequest(new { message = "Invalid email or password." });
        }

        var token = _tokenService.CreateToken(user);
        return Ok(new
        {
            token,
            user = new { user.Id, user.Name, user.Email, Role = user.Role.ToString() }
        });
    }
}
