namespace fitcore_backend.Entity;

public class StepLog
{
    public Guid Id { get; set; }

    public Guid UserId { get; set; }

    public DateTime Date { get; set; } = DateTime.UtcNow.Date;

    public int Steps { get; set; }
}