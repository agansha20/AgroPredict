package com.agropredict.controller;

import com.agropredict.model.YieldPrediction;
import com.agropredict.repository.YieldPredictionRepository;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.CrossOrigin;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/yield")
@CrossOrigin(origins = "*")
public class YieldController {

    private final YieldPredictionRepository repository;

    public YieldController(YieldPredictionRepository repository) {
        this.repository = repository;
    }


    // =========================================================
    // YIELD PREDICTION
    // =========================================================

    @PostMapping("/predict")
    public ResponseEntity<?> predictYield(
            @RequestBody YieldPrediction prediction) {

        System.out.println();
        System.out.println("========================================");
        System.out.println("        YIELD REQUEST RECEIVED");
        System.out.println("========================================");

        System.out.println("User ID    : " + prediction.getUserId());
        System.out.println("Crop       : " + prediction.getCrop());
        System.out.println("Area       : " + prediction.getArea());
        System.out.println("Fertilizer : " + prediction.getFertilizer());
        System.out.println("Rainfall   : " + prediction.getRainfall());

        System.out.println("========================================");


        // ---------------------------------------------------------
        // USER ID
        // ---------------------------------------------------------

        if (prediction.getUserId() == null) {

            return ResponseEntity
                    .badRequest()
                    .body(
                            Map.of(
                                    "message",
                                    "User ID is required"
                            )
                    );
        }


        // ---------------------------------------------------------
        // CROP
        // ---------------------------------------------------------

        if (prediction.getCrop() == null
                || prediction.getCrop().trim().isEmpty()) {

            return ResponseEntity
                    .badRequest()
                    .body(
                            Map.of(
                                    "message",
                                    "Crop is required"
                            )
                    );
        }


        // ---------------------------------------------------------
        // AREA
        // ---------------------------------------------------------

        if (prediction.getArea() == null
                || prediction.getArea() <= 0) {

            return ResponseEntity
                    .badRequest()
                    .body(
                            Map.of(
                                    "message",
                                    "Valid area is required"
                            )
                    );
        }


        // ---------------------------------------------------------
        // RAINFALL
        // ---------------------------------------------------------

        if (prediction.getRainfall() == null
                || prediction.getRainfall() < 0) {

            return ResponseEntity
                    .badRequest()
                    .body(
                            Map.of(
                                    "message",
                                    "Valid rainfall is required"
                            )
                    );
        }


        // =========================================================
        // FERTILIZER VALUE
        // =========================================================

        double fertilizerValue = 30.0;

        String fertilizer =
                prediction.getFertilizer();


        if (fertilizer != null
                && !fertilizer.trim().isEmpty()) {

            String fertilizerText =
                    fertilizer.toLowerCase();


            if (fertilizerText.contains("organic")) {

                fertilizerValue = 20.0;

            }
            else if (fertilizerText.contains("urea")) {

                fertilizerValue = 40.0;

            }
            else if (fertilizerText.contains("npk")) {

                fertilizerValue = 50.0;

            }
            else {

                fertilizerValue = 30.0;
            }
        }


        // =========================================================
        // INPUT VALUES
        // =========================================================

        double area =
                prediction.getArea();

        double rainfall =
                prediction.getRainfall();


        // =========================================================
        // YIELD CALCULATION
        // =========================================================

        double predictedYield =
                (area * 2.5)
                + (fertilizerValue * 0.05)
                + (rainfall * 0.01);


        prediction.setPredictedYield(
                predictedYield
        );


        // =========================================================
        // CREATED TIME
        // =========================================================

        prediction.setCreatedAt(
                LocalDateTime.now()
        );


        // =========================================================
        // SAVE TO DATABASE
        // =========================================================

        YieldPrediction saved =
                repository.save(prediction);


        // =========================================================
        // SUCCESS LOG
        // =========================================================

        System.out.println();
        System.out.println("========================================");
        System.out.println("       YIELD PREDICTION SUCCESS");
        System.out.println("========================================");

        System.out.println("ID         : " + saved.getId());
        System.out.println("User ID    : " + saved.getUserId());
        System.out.println("Crop       : " + saved.getCrop());
        System.out.println("Area       : " + saved.getArea());
        System.out.println("Fertilizer : " + saved.getFertilizer());
        System.out.println("Rainfall   : " + saved.getRainfall());
        System.out.println("Yield      : " + saved.getPredictedYield());

        System.out.println("========================================");
        System.out.println();


        return ResponseEntity.ok(saved);
    }


    // =========================================================
    // GET YIELD HISTORY
    // =========================================================

    @GetMapping("/history/{userId}")
    public ResponseEntity<List<YieldPrediction>> getHistory(
            @PathVariable Long userId) {

        List<YieldPrediction> history =
                repository.findByUserIdOrderByCreatedAtDesc(
                        userId
                );

        return ResponseEntity.ok(history);
    }


    // =========================================================
    // DELETE YIELD HISTORY
    // =========================================================

    @DeleteMapping("/history/{userId}")
    public ResponseEntity<?> deleteHistory(
            @PathVariable Long userId) {

        List<YieldPrediction> history =
                repository.findByUserIdOrderByCreatedAtDesc(
                        userId
                );


        repository.deleteAll(history);


        return ResponseEntity.ok(
                Map.of(
                        "message",
                        "Yield history cleared"
                )
        );
    }
}