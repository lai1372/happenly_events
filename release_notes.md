# Release Notes

## 📦 January 2026 Release

### ✨ Latest Features
- Added **offline detection** with a visible banner to inform users when connectivity is lost.
- Introduced an **Event model** to support the event creation flow and type safety.

### 🛠 Improvements
- Reworked navigation:
  - Added a **hamburger menu**
  - Removed tab-based navigation
- UI and styling enhancements:
  - Integrated **React Native Paper** styling
  - Added card-based layouts to event lists and detail views
  - Improved Create Event form styling
- Improved mobile layout and spacing:
  - Added `ScrollView` and `SafeAreaView` for better padding and usability
- UX and accessibility tweaks:
  - Clearer login labels
  - Larger page titles
  - Improved padding and spacing in the hamburger menu
- Improved date readability by updating the date format regex.

### 🐛 Bug Fixes
- Fixed an issue where forms were not scrolling correctly.
- Updated the View Details page to stack buttons vertically, preventing layout issues caused by the delete button.
- Improved refresh behavior by switching from `useEffect` to Expo Router `useFocus`.
- Refactored the edit flow so `handleSave` now calls the API directly.
- Added user feedback for failed delete actions (sad-path alert handling).

### ✅ Testing & Quality
- Added tests covering:
  - Event creation
  - Event deletion
  - Sad-path scenarios
- Added inline code comments to improve clarity and maintainability.
