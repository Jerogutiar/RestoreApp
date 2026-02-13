using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace RestorAPP.Backend.Models;

public class Product
{
    [Key]
    public int Id { get; set; }

    [Required]
    [MaxLength(120)]
    public string Name { get; set; } = string.Empty;

    public string? Description { get; set; }

    [Column(TypeName = "decimal(10,2)")]
    public decimal Price { get; set; }

    public int Stock { get; set; } = 0;

    public bool IsActive { get; set; } = true;

    // Added as requested by backend dev requirements
    public string? LinkImage { get; set; }

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}
