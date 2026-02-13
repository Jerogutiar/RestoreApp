using System.ComponentModel.DataAnnotations;

namespace RestorAPP.Backend.DTOs;

public class ProductRequestDto
{
    [Required]
    [MaxLength(120)]
    public string Name { get; set; } = string.Empty;

    public string? Description { get; set; }

    [Required]
    [Range(0.01, double.MaxValue, ErrorMessage = "Price must be greater than 0")]
    public decimal Price { get; set; }

    [Required]
    [Range(0, int.MaxValue)]
    public int Stock { get; set; }

    public string? LinkImage { get; set; }

    public bool IsActive { get; set; } = true;
}
