namespace fitcore_backend.Dto;

public class NutritionDayDto
{
    public Guid Id { get; set; }
    
    public DateTime Date { get; set; }
    
    public double ConsumedCalories { get; set; }
    public double TargetCalories { get; set; }
    
    public List<MealDto> Meals { get; set; } = new();
}