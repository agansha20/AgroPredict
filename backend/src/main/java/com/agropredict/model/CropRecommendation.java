package com.agropredict.model;

import jakarta.persistence.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "crop_recommendations")
public class CropRecommendation {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;


    @Column(name = "user_id", nullable = false)
    private Long userId;


    private Double nitrogen;

    private Double phosphorus;

    private Double ph;

    private Double temperature;

    private Double humidity;

    private Double rainfall;


    @Column(name = "recommended_crop")
    private String recommendedCrop;


    @Column(name = "created_at")
    private LocalDateTime createdAt;


    public CropRecommendation() {
    }


    public Long getId() {
        return id;
    }


    public Long getUserId() {
        return userId;
    }


    public void setUserId(Long userId) {
        this.userId = userId;
    }


    public Double getNitrogen() {
        return nitrogen;
    }


    public void setNitrogen(Double nitrogen) {
        this.nitrogen = nitrogen;
    }


    public Double getPhosphorus() {
        return phosphorus;
    }


    public void setPhosphorus(Double phosphorus) {
        this.phosphorus = phosphorus;
    }


    public Double getPh() {
        return ph;
    }


    public void setPh(Double ph) {
        this.ph = ph;
    }


    public Double getTemperature() {
        return temperature;
    }


    public void setTemperature(Double temperature) {
        this.temperature = temperature;
    }


    public Double getHumidity() {
        return humidity;
    }


    public void setHumidity(Double humidity) {
        this.humidity = humidity;
    }


    public Double getRainfall() {
        return rainfall;
    }


    public void setRainfall(Double rainfall) {
        this.rainfall = rainfall;
    }


    public String getRecommendedCrop() {
        return recommendedCrop;
    }


    public void setRecommendedCrop(
            String recommendedCrop) {

        this.recommendedCrop =
                recommendedCrop;
    }


    public LocalDateTime getCreatedAt() {
        return createdAt;
    }


    public void setCreatedAt(
            LocalDateTime createdAt) {

        this.createdAt =
                createdAt;
    }
}