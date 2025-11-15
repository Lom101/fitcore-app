namespace fitcore_backend.Entity;

/// <summary>
/// Cводка питания за день
/// </summary>
public class NutritionDay
{
    public Guid Id { get; set; }
    public Guid UserId { get; set; }

    public DateTime Date { get; set; } = DateTime.UtcNow.Date;

    public double ConsumedCalories { get; set; }
    public double TargetCalories { get; set; }

    public User User { get; set; } = null!;
    public ICollection<Meal> Meals { get; set; }
}
