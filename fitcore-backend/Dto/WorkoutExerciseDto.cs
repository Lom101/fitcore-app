namespace fitcore_backend.Dto;

public class WorkoutExerciseDto
{
    public Guid Id { get; set; }
    
    public string Name { get; set; }
    
    public bool Completed { get; set; }
    
    public List<WorkoutSetDto> Sets { get; set; } = new();
}