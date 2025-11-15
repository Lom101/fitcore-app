using fitcore_backend.Entity;

namespace fitcore_backend.Dto;

public class MealDto
{
    public Guid Id { get; set; }
    
    public MealType MealType { get; set; }
    
    public double Protein { get; set; }
    public double Fat { get; set; }
    public double Carbs { get; set; }
}