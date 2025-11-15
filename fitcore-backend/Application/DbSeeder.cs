using fitcore_backend.Entity;

namespace fitcore_backend.Application
{
    public static class DbSeeder
    {
        public static void Seed(AppDbContext db)
        {
            if (db.Users.Any())
                return; // Уже есть данные

            // Пользователи
            var user1 = new User
            {
                Email = "string",
                Password = "string",
                Username = "Иван",
                IsPremium = true,
                CreatedAt = DateTime.UtcNow
            };

            var user2 = new User
            {
                Email = "string1",
                Password = "string1",
                Username = "Мария",
                IsPremium = false,
                CreatedAt = DateTime.UtcNow
            };

            db.Users.AddRange(user1, user2);
            db.SaveChanges();

            // Тренировки для пользователя 1
            var workout1 = new Workout
            {
                UserId = user1.Id,
                Title = "Силовая тренировка",
                Date = DateTime.UtcNow.Date,
                Completed = false,
                DurationMinutes = 60,
                Exercises = new List<WorkoutExercise>
                {
                    new WorkoutExercise
                    {
                        Name = "Приседания",
                        Sets = new List<WorkoutSet>
                        {
                            new WorkoutSet { Reps = 12, Weight = 50 },
                            new WorkoutSet { Reps = 12, Weight = 50 }
                        }
                    },
                    new WorkoutExercise
                    {
                        Name = "Отжимания",
                        Sets = new List<WorkoutSet>
                        {
                            new WorkoutSet { Reps = 10, Weight = 0 },
                            new WorkoutSet { Reps = 10, Weight = 0 }
                        }
                    },
                    new WorkoutExercise
                    {
                        Name = "Подтягивания",
                        Sets = new List<WorkoutSet>
                        {
                            new WorkoutSet { Reps = 8, Weight = 0 },
                            new WorkoutSet { Reps = 8, Weight = 0 }
                        }
                    }
                }
            };
            
            var workout2 = new Workout
            {
                UserId = user1.Id,
                Title = "Кардио",
                Date = DateTime.UtcNow.AddDays(1),
                Completed = false,
                DurationMinutes = 45,
                Exercises = new List<WorkoutExercise>
                {
                    new WorkoutExercise
                    {
                        Name = "Бег на дорожке",
                        Sets = new List<WorkoutSet>
                        {
                            new WorkoutSet { Reps = 1, Weight = 0 } // Время/расстояние
                        }
                    }
                }
            };
            
            db.Workouts.AddRange(workout1, workout2);
            
            db.Measurements.AddRange(new Measurement
                {
                    UserId = user1.Id,
                    Date = DateTime.UtcNow.AddDays(-7),
                    WeightKg = 79,
                    ChestCm = 100,
                    WaistCm = 85,
                    HipCm = 98
                },
                new Measurement
                {
                    UserId = user1.Id,
                    Date = DateTime.UtcNow,
                    WeightKg = 78,
                    ChestCm = 100,
                    WaistCm = 84,
                    HipCm = 97
                });

            var nutritionDay1 = new NutritionDay
            {
                UserId = user1.Id,
                Date = DateTime.UtcNow.Date,
                ConsumedCalories = 2200,
                TargetCalories = 2500,
                Meals = new List<Meal>
                {
                    new Meal { MealType = MealType.Breakfast, Protein = 25, Fat = 15, Carbs = 50 },
                    new Meal { MealType = MealType.Lunch, Protein = 40, Fat = 20, Carbs = 60 },
                    new Meal { MealType = MealType.Dinner, Protein = 35, Fat = 15, Carbs = 55 },
                    new Meal { MealType = MealType.Snacks, Protein = 10, Fat = 5, Carbs = 20 }
                }
            };

            db.NutritionDays.Add(nutritionDay1);            
            
            db.StepLogs.Add(new StepLog
            {
                UserId = user1.Id,
                Date = DateTime.UtcNow.Date,
                Steps = 5000
            });
            
            
            db.SaveChanges();
        }
    }
}
