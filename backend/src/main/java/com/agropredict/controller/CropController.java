package com.agropredict.controller;

import com.agropredict.model.CropRecommendation;
import com.agropredict.repository.CropRecommendationRepository;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.*;

@RestController
@RequestMapping("/api/crop")
@CrossOrigin(origins = "*")
public class CropController {

    private final CropRecommendationRepository repository;

    public CropController(CropRecommendationRepository repository) {
        this.repository = repository;
    }

    @PostMapping("/recommend")
    public ResponseEntity<?> recommendCrop(
            @RequestBody CropRecommendation recommendation) {

        if (recommendation.getUserId() == null) {
            return ResponseEntity.badRequest()
                    .body(Map.of("message", "User ID is required"));
        }

        if (recommendation.getNitrogen() == null ||
            recommendation.getPhosphorus() == null ||
            recommendation.getPh() == null ||
            recommendation.getTemperature() == null ||
            recommendation.getHumidity() == null ||
            recommendation.getRainfall() == null) {

            return ResponseEntity.badRequest()
                    .body(Map.of("message", "All parameters are required"));
        }

        double n = recommendation.getNitrogen();
        double p = recommendation.getPhosphorus();
        double ph = recommendation.getPh();
        double temp = recommendation.getTemperature();
        double humidity = recommendation.getHumidity();
        double rainfall = recommendation.getRainfall();

        // ==========================================
        // CROP SCORES
        // ==========================================

        // ==========================================
// CROP SCORES
// ==========================================

Map<String, Double> scores = new LinkedHashMap<>();

// 1. RICE
scores.put("Rice",
        cropScore(
                n, 80, 120,
                p, 40, 80,
                ph, 5.5, 7.0,
                temp, 25, 32,
                humidity, 70, 95,
                rainfall, 150, 300
        ));

// 2. MAIZE
scores.put("Maize",
        cropScore(
                n, 50, 100,
                p, 30, 70,
                ph, 5.5, 7.5,
                temp, 20, 30,
                humidity, 50, 80,
                rainfall, 60, 120
        ));

// 3. WHEAT
scores.put("Wheat",
        cropScore(
                n, 30, 80,
                p, 20, 60,
                ph, 6.0, 7.5,
                temp, 10, 24,
                humidity, 40, 70,
                rainfall, 30, 90
        ));

// 4. GROUNDNUT
scores.put("Groundnut",
        cropScore(
                n, 20, 60,
                p, 20, 50,
                ph, 5.5, 7.0,
                temp, 24, 32,
                humidity, 40, 70,
                rainfall, 50, 100
        ));

// 5. COTTON
scores.put("Cotton",
        cropScore(
                n, 40, 80,
                p, 20, 60,
                ph, 5.5, 8.0,
                temp, 21, 35,
                humidity, 40, 80,
                rainfall, 50, 120
        ));

// 6. POTATO
scores.put("Potato",
        cropScore(
                n, 50, 100,
                p, 30, 70,
                ph, 5.0, 6.5,
                temp, 15, 25,
                humidity, 50, 80,
                rainfall, 50, 120
        ));

// 7. TOMATO
scores.put("Tomato",
        cropScore(
                n, 40, 80,
                p, 30, 60,
                ph, 5.5, 7.0,
                temp, 20, 30,
                humidity, 50, 80,
                rainfall, 50, 100
        ));

// 8. ONION
scores.put("Onion",
        cropScore(
                n, 30, 70,
                p, 20, 50,
                ph, 6.0, 7.0,
                temp, 13, 25,
                humidity, 50, 70,
                rainfall, 35, 80
        ));

// 9. SUGARCANE
scores.put("Sugarcane",
        cropScore(
                n, 80, 150,
                p, 40, 80,
                ph, 6.0, 7.5,
                temp, 20, 35,
                humidity, 60, 90,
                rainfall, 150, 300
        ));

// 10. BANANA
scores.put("Banana",
        cropScore(
                n, 70, 120,
                p, 30, 70,
                ph, 5.5, 7.5,
                temp, 24, 35,
                humidity, 70, 95,
                rainfall, 100, 250
        ));

// 11. COCONUT
scores.put("Coconut",
        cropScore(
                n, 50, 100,
                p, 20, 60,
                ph, 5.5, 7.0,
                temp, 24, 32,
                humidity, 70, 95,
                rainfall, 150, 300
        ));

// 12. CARROT
scores.put("Carrot",
        cropScore(
                n, 30, 70,
                p, 20, 50,
                ph, 5.5, 7.0,
                temp, 15, 25,
                humidity, 50, 75,
                rainfall, 40, 100
        ));

// 13. CHILLI
scores.put("Chilli",
        cropScore(
                n, 40, 80,
                p, 20, 60,
                ph, 5.5, 7.0,
                temp, 20, 30,
                humidity, 50, 75,
                rainfall, 50, 100
        ));

// 14. SOYBEAN
scores.put("Soybean",
        cropScore(
                n, 30, 70,
                p, 30, 60,
                ph, 6.0, 7.5,
                temp, 20, 30,
                humidity, 50, 80,
                rainfall, 60, 150
        ));

// 15. CHICKPEA
scores.put("Chickpea",
        cropScore(
                n, 20, 60,
                p, 20, 50,
                ph, 6.0, 8.0,
                temp, 15, 30,
                humidity, 30, 60,
                rainfall, 40, 90
        ));
        // ==========================================
        // FIND HIGHEST SCORE
        // ==========================================

        String recommendedCrop = scores.entrySet()
                .stream()
                .max(Map.Entry.comparingByValue())
                .map(Map.Entry::getKey)
                .orElse("Maize");

        double highestScore = scores.get(recommendedCrop);

        // ==========================================
        // SAVE
        // ==========================================

        recommendation.setRecommendedCrop(recommendedCrop);
        recommendation.setCreatedAt(LocalDateTime.now());

        CropRecommendation saved =
                repository.save(recommendation);

        // Debug information in console
        System.out.println("--------------------------------");
        System.out.println("CROP RECOMMENDATION");
        System.out.println("N          : " + n);
        System.out.println("P          : " + p);
        System.out.println("pH         : " + ph);
        System.out.println("Temperature: " + temp);
        System.out.println("Humidity   : " + humidity);
        System.out.println("Rainfall   : " + rainfall);
        System.out.println("Scores     : " + scores);
        System.out.println("Recommended: " + recommendedCrop);
        System.out.println("Score      : " + highestScore);
        System.out.println("--------------------------------");

        return ResponseEntity.ok(saved);
    }

    // ==========================================
    // SCORE CALCULATION
    // ==========================================

    private double cropScore(
            double n, double nMin, double nMax,
            double p, double pMin, double pMax,
            double ph, double phMin, double phMax,
            double temp, double tempMin, double tempMax,
            double humidity, double humidityMin, double humidityMax,
            double rainfall, double rainfallMin, double rainfallMax) {

        double score = 0;

        score += rangeScore(n, nMin, nMax);
        score += rangeScore(p, pMin, pMax);
        score += rangeScore(ph, phMin, phMax);
        score += rangeScore(temp, tempMin, tempMax);
        score += rangeScore(humidity, humidityMin, humidityMax);
        score += rangeScore(rainfall, rainfallMin, rainfallMax);

        return score;
    }

    // ==========================================
    // RANGE SCORE
    // ==========================================

    private double rangeScore(
            double value,
            double min,
            double max) {

        // Perfect match inside ideal range
        if (value >= min && value <= max) {
            return 1.0;
        }

        // Distance from ideal range
        double distance;

        if (value < min) {
            distance = min - value;
        } else {
            distance = value - max;
        }

        // Gradual penalty instead of immediately becoming zero
        return 1.0 / (1.0 + distance);
    }

    // ==========================================
    // HISTORY
    // ==========================================

    @GetMapping("/history/{userId}")
    public ResponseEntity<List<CropRecommendation>> getHistory(
            @PathVariable Long userId) {

        return ResponseEntity.ok(
                repository.findByUserIdOrderByCreatedAtDesc(userId)
        );
    }

    // ==========================================
    // DELETE USER CROP HISTORY
    // ==========================================

    @DeleteMapping("/history/{userId}")
    public ResponseEntity<?> deleteHistory(
            @PathVariable Long userId) {

        List<CropRecommendation> history =
                repository.findByUserIdOrderByCreatedAtDesc(userId);

        repository.deleteAll(history);

        return ResponseEntity.ok(
                Map.of("message", "Crop history cleared")
        );
    }
}