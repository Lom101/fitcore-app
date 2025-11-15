namespace fitcore_backend.Entity;

/// <summary>
/// Хранит всю информацию о пользователе, включая данные для логина.
/// </summary>
public class User
{
    public Guid Id { get; set; }

    // Авторизация
    public string Email { get; set; } = null!;
    public string Password { get; set; } = null!; // без хеширования

    public string Username { get; set; } = null!;
    public bool IsPremium { get; set; } = false;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    // Физические параметры
    public int? Age { get; set; }
    public double? HeightCm { get; set; }
    public double? WeightKg { get; set; }

    // Навигация
    public ICollection<Workout> Workouts { get; set; }
    public ICollection<Measurement> Measurements { get; set; }
    public ICollection<NutritionDay> NutritionDays { get; set; }
}