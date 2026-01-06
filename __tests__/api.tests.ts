/** @jest-environment jsdom */
import { getDoc, getDocs, addDoc, updateDoc, deleteDoc } from "firebase/firestore";

import { getAllEvents, getEventById, createEvent, updateEvent, deleteEvent } from "../app/(tabs)/events/api";

// Mock Firebase Firestore functions
jest.mock("firebase/firestore", () => ({
  addDoc: jest.fn(),
  collection: jest.fn(() => ({ __type: "collectionRef" })),
  deleteDoc: jest.fn(),
  doc: jest.fn(() => ({ __type: "docRef" })),
  getDoc: jest.fn(),
  getDocs: jest.fn(),
  query: jest.fn((x) => x),
  updateDoc: jest.fn(),
}));

// Mock Firebase client
jest.mock("@/src/core/firebase/client", () => ({
  db: {},
  auth: {},
}));

// Clear all mocks before each test
describe("events api", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("getAllEvents maps snapshot of docs to { id, ...data }", async () => {
    // Arrange
    (getDocs as jest.Mock).mockResolvedValue({
      docs: [
        {
          id: "e1",
          data: () => ({
            title: "Event A",
            description: "A sample description for Event A",
            location: "London",
            date: "2026-03-15",
            categoryId: "music",
            imageUrl: "https://example.com/event-a.jpg",
            imageDescription: "Crowd at a live music event",
          }),
        },
        {
          id: "e2",
          data: () => ({
            title: "Event B",
            description: "A sample description for Event B",
            location: "Manchester",
            date: "2026-04-02",
            categoryId: "art",
            imageUrl: "https://example.com/event-b.jpg",
            imageDescription: "Gallery space with modern art",
          }),
        },
      ],
    });

    // Act
    const events = await getAllEvents();

    // Assert
    expect(getDocs).toHaveBeenCalledTimes(1);
    expect(events).toEqual([
      {
        id: "e1",
        title: "Event A",
        description: "A sample description for Event A",
        location: "London",
        date: "2026-03-15",
        categoryId: "music",
        imageUrl: "https://example.com/event-a.jpg",
        imageDescription: "Crowd at a live music event",
      },
      {
        id: "e2",
        title: "Event B",
        description: "A sample description for Event B",
        location: "Manchester",
        date: "2026-04-02",
        categoryId: "art",
        imageUrl: "https://example.com/event-b.jpg",
        imageDescription: "Gallery space with modern art",
      },
    ]);
  });

  test("getAllEvents returns empty array when no documents", async () => {
    // Arrange
    (getDocs as jest.Mock).mockResolvedValue({
      docs: [],
    });

    // Act
    const events = await getAllEvents();

    // Assert
    expect(getDocs).toHaveBeenCalledTimes(1);
    expect(events).toEqual([]);
  });

  test("getEvent returns event data for a given ID", async () => {
    // Arrange
    (getDoc as jest.Mock).mockResolvedValue({
      exists: () => true,
      id: "e1",
      data: () => ({
        title: "Event A",
        description: "A sample description for Event A",
        location: "London",
        date: "2026-03-15",
        categoryId: "music",
        imageUrl: "https://example.com/event-a.jpg",
        imageDescription: "Crowd at a live music event",
      }),
    });

    // Act
    const event = await getEventById("e1");

    // Assert
    expect(getDoc).toHaveBeenCalledTimes(1);
    expect(event).toEqual({
      id: "e1",
      title: "Event A",
      description: "A sample description for Event A",
      location: "London",
      date: "2026-03-15",
      categoryId: "music",
      imageUrl: "https://example.com/event-a.jpg",
      imageDescription: "Crowd at a live music event",
    });
  });

  test("getEvent returns null for non-existing ID", async () => {
    // Arrange
    (getDoc as jest.Mock).mockResolvedValue({
      exists: () => false,
    });

    // Act
    const event = await getEventById("nonexistent-id");

    // Assert
    expect(getDoc).toHaveBeenCalledTimes(1);
    expect(event).toBeNull();
  });

  test("createEvent adds a new event document", async () => {
    // Arrange 
    const newEvent = {
      title: "Event C",
      description: "A sample description for Event C",
      location: "Bristol",
      date: "2026-05-10",
      categoryId: "theatre",
      imageUrl: "https://example.com/event-c.jpg",
      imageDescription: "Actors performing on stage",
    };
    (addDoc as jest.Mock).mockResolvedValue({ id: "e3" });

    // Act
    const result = await createEvent(newEvent);

    // Assert
    expect(addDoc).toHaveBeenCalledTimes(1);
    expect(addDoc).toHaveBeenCalledWith(
      { __type: "collectionRef" },
      {
        title: "Event C",
        description: "A sample description for Event C",
        location: "Bristol",
        date: "2026-05-10",
        categoryId: "theatre",
        imageUrl: "https://example.com/event-c.jpg",
        imageDescription: "Actors performing on stage",
      }
    );
    expect(result).toEqual({ id: "e3" });
  });

  test("createEvent throws error when addDoc fails", async () => {
    // Arrange
    const newEvent = {
      title: "Event D",
      description: "A sample description for Event D",
      location: "Leeds",
      date: "2026-06-20",
      categoryId: "comedy",
      imageUrl: "https://example.com/event-d.jpg",
      imageDescription: "Comedian on stage",
    };
    (addDoc as jest.Mock).mockRejectedValue(new Error("Firestore addDoc error"));

    // Act
    await expect(createEvent(newEvent)).rejects.toThrow("Firestore addDoc error");

    // Assert
    expect(addDoc).toHaveBeenCalledTimes(1);
  });

  test("updateEvent updates an existing event document", async () => {
    // Arrange
    const updatedData = {
      title: "Updated Event A",
      location: "Edinburgh",
    };

    // Act
    await updateEvent("e1", updatedData);

    // Assert
    expect(updateDoc).toHaveBeenCalledTimes(1);
    expect(updateDoc).toHaveBeenCalledWith(
      { __type: "docRef" },
      {
        title: "Updated Event A",
        location: "Edinburgh",
      }
    );
  });

  test("updateEvent throws error when updateDoc fails", async () => {
    // Arrange
    const updatedData = {
      title: "Updated Event B",
    };
    (updateDoc as jest.Mock).mockRejectedValue(new Error("Firestore updateDoc error"));

    // Act
    await expect(updateEvent("e2", updatedData)).rejects.toThrow("Firestore updateDoc error");

    // Assert
    expect(updateDoc).toHaveBeenCalledTimes(1);
  });

  test("deleteEvent removes an event document", async () => {
    // Act
    await deleteEvent("e1");

    // Assert
    expect(deleteDoc).toHaveBeenCalledTimes(1);
    expect(deleteDoc).toHaveBeenCalledWith({ __type: "docRef" });
  });

  test("deleteEvent throws error when deleteDoc fails", async () => {
    // Arrange
    (deleteDoc as jest.Mock).mockRejectedValue(new Error("Firestore deleteDoc error"));

    // Act
    await expect(deleteEvent("e2")).rejects.toThrow("Firestore deleteDoc error");

    // Assert
    expect(deleteDoc).toHaveBeenCalledTimes(1);
  });
});
