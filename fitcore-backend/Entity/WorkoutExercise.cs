namespace fitcore_backend.Entity;

/// <summary>
/// Упражнение в тренировке
/// </summary>
public class WorkoutExercise
{
    public Guid Id { get; set; }
    public Guid WorkoutId { get; set; }

    public string Name { get; set; } = null!;
    
    public bool Completed { get; set; } = false;
    
    // Наборы подходов
    public ICollection<WorkoutSet> Sets { get; set; } = new List<WorkoutSet>();

    public Workout Workout { get; set; } = null!;
}
