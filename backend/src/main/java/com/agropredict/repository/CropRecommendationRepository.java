package com.agropredict.repository;

import com.agropredict.model.CropRecommendation;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface CropRecommendationRepository
        extends JpaRepository<CropRecommendation, Long> {

    List<CropRecommendation> findByUserIdOrderByCreatedAtDesc(Long userId);
}