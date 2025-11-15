namespace fitcore_backend.Dto;

public class WorkoutDto
{
    public Guid Id { get; set; }
    
    public string Title { get; set; }
    public DateTime Date { get; set; }

    public bool Completed { get; set; }
    public int DurationMinutes { get; set; }
    
    public List<WorkoutExerciseDto> Exercises { get; set; } = new();
}