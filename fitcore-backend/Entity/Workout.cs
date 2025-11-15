namespace fitcore_backend.Entity;

/// <summary>
/// Тренировка
/// </summary>
public class Workout
{
    public Guid Id { get; set; }
    public Guid UserId { get; set; }

    public string Title { get; set; } = null!;
    public DateTime Date { get; set; } = DateTime.UtcNow;
    
    public bool Completed { get; set; } = false;
    public int DurationMinutes { get; set; }

    public User User { get; set; } = null!;
    public ICollection<WorkoutExercise> Exercises { get; set; } = new List<WorkoutExercise>();
}
