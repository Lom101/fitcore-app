namespace fitcore_backend.Entity;

/// <summary>
/// Подход
/// </summary>
public class WorkoutSet
{
    public Guid Id { get; set; }
    public Guid WorkoutExerciseId { get; set; }

    public int Reps { get; set; }
    public double Weight { get; set; } // кг
    
    public bool Completed { get; set; } = false;

    public WorkoutExercise WorkoutExercise { get; set; } = null!;
}
