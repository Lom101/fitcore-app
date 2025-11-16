import axios from "axios";
import {User} from "../models/User.ts";
import {Workout} from "../models/Workout.ts";
import {Measurement} from "../models/Measurement.ts";
import {NutritionDay} from "../models/NutritionDay.ts";
import {Meal} from "../models/Meal.ts";

// Базовый URL API
const API_URL = "http://localhost:8080/api";

// Получение токена из localStorage
const getToken = () => localStorage.getItem("token");

const axiosInstance = axios.create({
  baseURL: API_URL,
});

// Добавляем токен автоматически
axiosInstance.interceptors.request.use((config) => {
  const token = getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const api = {
  async login(email: string, password: string): Promise<string> {
    const res = await axios.post(`${API_URL}/auth/login`, { email, password });
    return res.data.token; // JWT
  },

  async register(email: string, password: string, username: string): Promise<void> {
    await axios.post(`${API_URL}/auth/register`, { email, password, username });
  },

  // ===== User =====
  async getUser(): Promise<User> {
    const res = await axiosInstance.get("/user");
    return res.data;
  },

  async updateWeight(weightKg: number): Promise<User> {
    const res = await axiosInstance.put("/user/weight", { weightKg });
    return res.data;
  },


  // ===== Workouts =====
  async getWorkouts(): Promise<Workout[]> {
    const res = await axiosInstance.get("/workouts");
    return res.data;
  },

  async createWorkout(workout: Omit<Workout, "id" | "userId">): Promise<Workout> {
    const res = await axiosInstance.post("/workouts", workout);
    return res.data;
  },

  async deleteWorkout(workoutId: string): Promise<void> {
    await axiosInstance.delete(`/workouts/${workoutId}`);
  },

  async completeWorkout(workoutId: string): Promise<void> {
    await axiosInstance.post(`/workouts/${workoutId}/complete`);
  },

  async completeExercise(workoutId: string, exerciseId: string): Promise<void> {
    await axiosInstance.post(`/workouts/${workoutId}/exercise/${exerciseId}/complete`);
  },

  async completeSet(workoutId: string, exerciseId: string, setId: string): Promise<void> {
    await axiosInstance.post(`/workouts/${workoutId}/exercise/${exerciseId}/set/${setId}/complete`);
  },


  // ===== Measurements =====
  async getMeasurements(): Promise<Measurement[]> {
    const res = await axiosInstance.get("/measurements");
    return res.data;
  },

  async addMeasurement(measurement: Omit<Measurement, "id" | "userId">): Promise<Measurement> {
    const res = await axiosInstance.post("/measurements", measurement);
    return res.data;
  },

  // ===== Nutrition =====
  async getNutritionToday(): Promise<NutritionDay> {
    const res = await axiosInstance.get("/nutrition/today");
    return res.data;
  },
  
  async addMeal(meal: Omit<Meal, "id" | "nutritionDayId">): Promise<Meal> {
    const res = await axiosInstance.post("/nutrition/add-meal", meal);
    return res.data;
  },

  async deleteMeal(mealId: string): Promise<void> {
    await axiosInstance.delete(`/nutrition/meal/${mealId}`);
  },

  async getAllNutrition(): Promise<NutritionDay[]> {
    const res = await axiosInstance.get("/nutrition/all"); // новый эндпоинт на бэке
    return res.data;
  },

  // ===== Steps =====
  async getStepsToday(): Promise<{id: string, date: string, steps: number}> {
    const res = await axiosInstance.get("/steps/today");
    return res.data;
  },

  async addSteps(steps: number): Promise<{id: string, date: string, steps: number}> {
    const res = await axiosInstance.post("/steps/add", { steps });
    return res.data;
  },
};
