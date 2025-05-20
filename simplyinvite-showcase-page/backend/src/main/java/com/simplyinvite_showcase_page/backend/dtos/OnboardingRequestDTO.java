package com.simplyinvite_showcase_page.backend.dtos;

// Adicionar getters e setters para todos os campos

public class OnboardingRequestDTO {
    private String educationalBackground;
    private String institutionName;
    private String course; // De studyDetails.course
    private String yearOrPeriod; // De studyDetails.yearOrPeriod
    private String talentSource;
    private String humanizedCategory;
    private String customCategory;
    
    private boolean socialProgramParticipates;
    private String socialProgramName;
    private boolean socialProgramAuthorizeMention;

    private String experiences; // Mapear para bio ou novo campo
    private String portfolioLinks; // Mapear para campos de URL existentes ou novo

    // Não vamos incluir todos os campos de supportPaths e recognitionBadge por simplicidade inicial
    // mas eles podem ser adicionados depois.


    public String getEducationalBackground() {
        return educationalBackground;
    }

    public void setEducationalBackground(String educationalBackground) {
        this.educationalBackground = educationalBackground;
    }

    public String getInstitutionName() {
        return institutionName;
    }

    public void setInstitutionName(String institutionName) {
        this.institutionName = institutionName;
    }

    public String getCourse() {
        return course;
    }

    public void setCourse(String course) {
        this.course = course;
    }

    public String getYearOrPeriod() {
        return yearOrPeriod;
    }

    public void setYearOrPeriod(String yearOrPeriod) {
        this.yearOrPeriod = yearOrPeriod;
    }

    public String getTalentSource() {
        return talentSource;
    }

    public void setTalentSource(String talentSource) {
        this.talentSource = talentSource;
    }

    public String getHumanizedCategory() {
        return humanizedCategory;
    }

    public void setHumanizedCategory(String humanizedCategory) {
        this.humanizedCategory = humanizedCategory;
    }

    public String getCustomCategory() {
        return customCategory;
    }

    public void setCustomCategory(String customCategory) {
        this.customCategory = customCategory;
    }

    public boolean isSocialProgramParticipates() {
        return socialProgramParticipates;
    }

    public void setSocialProgramParticipates(boolean socialProgramParticipates) {
        this.socialProgramParticipates = socialProgramParticipates;
    }

    public String getSocialProgramName() {
        return socialProgramName;
    }

    public void setSocialProgramName(String socialProgramName) {
        this.socialProgramName = socialProgramName;
    }

    public boolean isSocialProgramAuthorizeMention() {
        return socialProgramAuthorizeMention;
    }

    public void setSocialProgramAuthorizeMention(boolean socialProgramAuthorizeMention) {
        this.socialProgramAuthorizeMention = socialProgramAuthorizeMention;
    }

    public String getExperiences() {
        return experiences;
    }

    public void setExperiences(String experiences) {
        this.experiences = experiences;
    }

    public String getPortfolioLinks() {
        return portfolioLinks;
    }

    public void setPortfolioLinks(String portfolioLinks) {
        this.portfolioLinks = portfolioLinks;
    }
} 