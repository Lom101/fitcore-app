namespace fitcore_backend.Dto;

public class WorkoutExerciseCreateDto
{
    public string Name { get; set; } = null!;
    public List<WorkoutSetCreateDto> Sets { get; set; } = new();
}