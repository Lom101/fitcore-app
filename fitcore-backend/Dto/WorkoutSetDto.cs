namespace fitcore_backend.Dto;

public class WorkoutSetDto
{
    public Guid Id { get; set; }
    
    public int Reps { get; set; }
    public double Weight { get; set; }
    
    public bool Completed { get; set; }
}