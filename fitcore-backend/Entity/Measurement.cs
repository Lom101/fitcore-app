namespace fitcore_backend.Entity;

/// <summary>
/// Дневник прогресса (замеры тела)
/// </summary>
public class Measurement
{
    public Guid Id { get; set; }
    public Guid UserId { get; set; }

    public DateTime Date { get; set; } = DateTime.UtcNow;

    public double? WeightKg { get; set; }
    public double? ChestCm { get; set; }
    public double? WaistCm { get; set; }
    public double? HipCm { get; set; }

    public User User { get; set; } = null!;
}
