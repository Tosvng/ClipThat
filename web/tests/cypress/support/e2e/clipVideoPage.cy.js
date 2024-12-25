/* global describe, beforeEach, it, cy */
describe("ClipVideoPage", () => {
  beforeEach(() => {
    // Visit the clip video page before each test
    cy.visit("/clip-video");
  });

  it("should render the main components", function () {
    // Check if main elements are visible
    cy.get('[data-testid="file-upload-area"]').should("be.visible");
    cy.get('input[type="text"]').should("be.visible");
    cy.get("button").contains("Clip Video").should("be.visible");
  });

  it("should handle file upload", () => {
    // Create a test file and trigger file upload
    cy.get('[data-testid="file-upload-area"]').attachFile({
      fileContent: "dummy video content",
      fileName: "test-video.mp4",
      mimeType: "video/mp4",
    });

    // Check if the file name is displayed
    cy.get('[data-testid="file-upload-area"]').should(
      "contain",
      "test-video.mp4"
    );
  });

  it("should handle keyword input", () => {
    const testKeyword = "test keyword";
    cy.get('input[type="text"]').type(testKeyword);
    cy.get('input[type="text"]').should("have.value", testKeyword);
  });

  it("should disable clip button when inputs are missing", () => {
    // Initially button should be disabled
    cy.get("button").contains("Clip Video").should("be.disabled");

    // Add only keyword
    cy.get('input[type="text"]').type("test");
    cy.get("button").contains("Clip Video").should("be.disabled");

    // Add only file
    cy.get('input[type="text"]').clear();
    cy.get('[data-testid="file-upload-area"]').attachFile({
      fileContent: "dummy video content",
      fileName: "test-video.mp4",
      mimeType: "video/mp4",
    });
    cy.get("button").contains("Clip Video").should("be.disabled");

    // Add both inputs
    cy.get('input[type="text"]').type("test");
    cy.get("button").contains("Clip Video").should("not.be.disabled");
  });

  it("should show loading state during clip generation", () => {
    // Setup file and keyword
    cy.get('[data-testid="file-upload-area"]').attachFile({
      fileContent: "dummy video content",
      fileName: "test-video.mp4",
      mimeType: "video/mp4",
    });
    cy.get('input[type="text"]').type("test");

    // Mock the API call
    cy.intercept("POST", "/api/generate-clips", (req) => {
      req.reply({ delay: 1000, fixture: "clipResponse.json" });
    }).as("generateClips");

    // Click generate button
    cy.get("button").contains("Clip Video").click();

    // Check loading state
    cy.contains("Generating clips. This might take a while").should(
      "be.visible"
    );

    // Wait for API response
    cy.wait("@generateClips");

    // Check success message
    cy.get(".alert").should("be.visible");
  });

  it("should handle drag and drop", () => {
    // Test drag and drop functionality
    cy.get('[data-testid="file-upload-area"]').trigger("dragenter");
    cy.get('[data-testid="file-upload-area"]').trigger("dragover");

    const fileContent = "dummy video content";
    const fileName = "test-video.mp4";

    cy.get('[data-testid="file-upload-area"]').trigger("drop", {
      dataTransfer: {
        files: [new File([fileContent], fileName, { type: "video/mp4" })],
      },
    });

    cy.get('[data-testid="file-upload-area"]').should("contain", fileName);
  });
});
