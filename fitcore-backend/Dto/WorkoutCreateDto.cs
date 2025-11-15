namespace fitcore_backend.Dto;

public class WorkoutCreateDto
{
    public string Title { get; set; } = null!;
    public DateTime Date { get; set; }
    public int DurationMinutes { get; set; }
    public List<WorkoutExerciseCreateDto> Exercises { get; set; } = new();
}
