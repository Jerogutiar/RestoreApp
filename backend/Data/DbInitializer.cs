using RestorAPP.Backend.Models;
using System.Security.Cryptography;
using System.Text;
using Microsoft.EntityFrameworkCore;

namespace RestorAPP.Backend.Data;

public static class DbInitializer
{
    public static void Initialize(AppDbContext context)
    {
        context.Database.Migrate();

        // Look for any users.
        if (context.Users.Any())
        {
            return;   // DB has been seeded
        }

        var adminUser = new User
        {
            Name = "Admin User",
            Email = "admin@restorapp.com",
            PasswordHash = BCrypt.Net.BCrypt.HashPassword("admin123"), // Default password
            Role = Role.Admin,
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow
        };

        context.Users.Add(adminUser);

        var products = new Product[]
        {
            new Product { Name = "Classic Burger", Description = "Beef patty, lettuce, tomato", Price = 8.99m, Stock = 50, LinkImage = "https://placehold.co/600x400/png" },
            new Product { Name = "Cheese Pizza", Description = "Tomato sauce, mozzarella", Price = 12.50m, Stock = 20, LinkImage = "https://placehold.co/600x400/png" },
            new Product { Name = "Coke Zero", Description = "Zero sugar cola", Price = 2.00m, Stock = 100, LinkImage = "https://placehold.co/600x400/png" }
        };

        context.Products.AddRange(products);
        context.SaveChanges();
    }
}
