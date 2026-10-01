package com.agropredict.repository;

import com.agropredict.model.YieldPrediction;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface YieldPredictionRepository
        extends JpaRepository<YieldPrediction, Long> {

    List<YieldPrediction> findByUserIdOrderByCreatedAtDesc(
            Long userId
    );
}