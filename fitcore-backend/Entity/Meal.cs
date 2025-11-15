namespace fitcore_backend.Entity;

/// <summary>
/// Прием пищи
/// </summary>
public class Meal
{
    public Guid Id { get; set; }
    public Guid NutritionDayId { get; set; }

    public MealType MealType { get; set; }

    public double Protein { get; set; }
    public double Fat { get; set; }
    public double Carbs { get; set; }

    public NutritionDay NutritionDay { get; set; } = null!;
}

public enum MealType {
    Breakfast = 0,
    Lunch = 1,
    Dinner = 2,
    Snacks = 3
}