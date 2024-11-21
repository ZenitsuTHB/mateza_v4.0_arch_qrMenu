# Documentation: General Reservation Settings Component

## Overview

The **General Reservation Settings** component is a React component that allows administrators to configure key reservation parameters for a restaurant. These settings include seat capacity, booking time constraints, maximum guests per reservation, and default reservation duration. This component interacts with an API to fetch and save settings, and it reflects changes in the user interface.

---

## Component Structure

### File Location

```
/src/Components/Settings/GeneralSettings.js
```

### Main Functionalities

- Fetches initial settings from the API upon component mount.
- Allows administrators to modify reservation-related settings.
- Validates and saves changes back to the server.
- Provides tooltips for additional information on each setting.

---

## Key Properties and Their Descriptions

### 1. **Number of Seats (`zitplaatsen`)**

- **Description**: The maximum number of seats available in the restaurant when no exceptions apply.
- **Data Type**: Integer
- **Input Constraints**:
  - Minimum: `0`
  - Maximum: `10000`
- **Storage Location**:
  - In the data structure, it is stored under the key `general-settings.zitplaatsen`.

**Example from Data Structure**:

```json
"general-settings": {
  "zitplaatsen": "8",
  // other settings...
}
```

### 2. **Minimum Hours in Advance to Book (`uurOpVoorhand`)**

- **Description**: The minimum number of hours that customers must book in advance.
- **Data Type**: Integer
- **Input Constraints**:
  - Minimum: `0`
  - Maximum: `400`
- **Storage Location**:
  - Stored under `general-settings.uurOpVoorhand`.

**Example**:

```json
"general-settings": {
  "uurOpVoorhand": "7",
  // other settings...
}
```

### 3. **Maximum Days in the Future to Book (`dagenInToekomst`)**

- **Description**: The maximum number of days into the future that customers can make a reservation.
- **Data Type**: Integer
- **Input Constraints**:
  - Minimum: `0`
  - Maximum: `400`
- **Storage Location**:
  - Stored under `general-settings.dagenInToekomst`.

**Example**:

```json
"general-settings": {
  "dagenInToekomst": "6",
  // other settings...
}
```

### 4. **Maximum Number of Guests per Online Booking (`maxGasten`)**

- **Description**: The maximum number of guests allowed per online reservation.
- **Data Type**: Integer
- **Input Constraints**:
  - Minimum: `0`
  - Maximum: `1000`
- **Storage Location**:
  - Stored under `general-settings.maxGasten`.

**Example**:

```json
"general-settings": {
  "maxGasten": "2",
  // other settings...
}
```

### 5. **Reservation Duration (`duurReservatie`)**

- **Description**: The default duration of a reservation in minutes.
- **Data Type**: Integer
- **Input Constraints**:
  - Minimum: `5`
  - Maximum: `10000`
- **Storage Location**:
  - Stored under `general-settings.duurReservatie`.

**Note**: In the provided data structure, `duurReservatie` is stored with an additional nested object due to the database format.

**Example**:

```json
"general-settings": {
  "duurReservatie": { "$numberInt": "0" },
  // other settings...
}
```

---

## Data Structure and Storage

### General Structure

The settings are part of a larger data object that contains various configurations for the restaurant's reservation system. The main categories include:

- **Colors**
- **Theme**
- **Page Settings**
- **Fonts**
- **Fields**
- **Time Blocks**
- **General Settings**
- **Email Settings**

### Location of General Settings

The general reservation settings are stored under the `general-settings` key in the data structure.

**Example**:

```json
{
  "_id": "thibault",
  // other settings...
  "general-settings": {
    "zitplaatsen": "8",
    "uurOpVoorhand": "7",
    "dagenInToekomst": "6",
    "maxGasten": "2",
    "duurReservatie": { "$numberInt": "0" },
    "storedNumber": { "$numberInt": "96" }
  },
  // other settings...
}
```

### Explanation of Fields

- **`_id`**: Unique identifier for the restaurant or user.
- **`storedNumber`**: An internal tracking number, possibly used for versioning or ordering.
- **Nested Objects**: Some values are stored as nested objects with `$numberInt` keys due to the database's handling of integer values.

---

## Interaction with the API

- **Fetching Settings**: On component mount, the settings are fetched from the API endpoint `/api/general-settings`.
- **Saving Settings**: Upon form submission, the settings are sent to the API via a `PUT` request to `/api/general-settings`.

---

## User Interface Elements

### Input Fields

Each setting is represented by an input field in the form, allowing the administrator to update its value.

- **Number Inputs**: All inputs are of type `number`, ensuring that only numerical values can be entered.
- **Placeholders**: Each input includes a placeholder that hints at the expected input.

### Labels and Tooltips

- **Labels**: Clearly describe the purpose of each setting.
- **Tooltips**: Provide additional information when hovering over the info icon (`FaInfoCircle`).

### Save Button

- **Enabled State**: The save button is enabled only when changes have been made (`isDirty` is `true`).
- **Disabled State**: If no changes are detected, the button is disabled to prevent unnecessary API calls.

---

## State Management

### useState Hooks

- **`settings`**: Holds the current values of the settings being edited.
- **`initialSettings`**: Stores the original settings fetched from the API for comparison.
- **`loading`**: Indicates whether the settings are currently being fetched.
  
### useEffect Hooks

- **Fetching Settings**: Fetches settings from the API when the component mounts.
- **Comparing Settings**: Uses `useMemo` to determine if any changes have been made (`isDirty`).

---

## Validation and Constraints

- **Minimum and Maximum Values**: Each input field has `min` and `max` attributes to prevent invalid entries.
- **Step Value**: The `step` attribute is set to `1` for integer inputs to avoid decimal values.

---

## Error Handling

- **API Errors**: If fetching or saving settings fails, an error message is displayed using the notification system.
- **Console Logging**: Errors are also logged to the console for debugging purposes.

---

## Related Data Structures

### Time Blocks (`timeblocks`)

- Stores specific time-based configurations, including exceptional days and scheme settings.

**Example**:

```json
"timeblocks": [
  {
    "id": "671e6d5f7272b4a71f47e12b",
    "date": "2024-11-21",
    "title": "Tijdsblok (27 oktober)",
    // other properties...
  }
]
```

### Exceptional Days (`exceptionalDays`)

- Contains exceptions to the regular schedule, such as closing periods or exceptional opening hours.

**Example**:

```json
"exceptionalDays": {
  "sluitingsperiode": [
    {
      "enabled": true,
      "startDate": "2024-11-22",
      "endDate": "2024-11-24"
    }
  ],
  "sluitingsdag": [
    {
      "enabled": true,
      "date": "2024-11-23"
    }
  ],
  "uitzonderlijkeOpeningsuren": [
    {
      "enabled": true,
      "date": "2024-11-22",
      "startTime": "04:15",
      "endTime": "06:15"
    }
  ]
}
```

---

## Summary of Settings and Their Impact

1. **`zitplaatsen` (Number of Seats)**
   - Determines the overall capacity for reservations.
   - Affects availability calculations in the reservation system.

2. **`uurOpVoorhand` (Minimum Hours in Advance)**
   - Prevents last-minute bookings.
   - Ensures the restaurant has sufficient time to prepare.

3. **`dagenInToekomst` (Maximum Days in Future)**
   - Limits how far ahead customers can book.
   - Helps in planning and managing future reservations.

4. **`maxGasten` (Maximum Guests per Booking)**
   - Controls the size of parties that can book online.
   - Larger groups may need special arrangements and are encouraged to call.

5. **`duurReservatie` (Reservation Duration)**
   - Sets a default time slot for each reservation.
   - Important for table turnover and scheduling.

---

## Conclusion

The General Reservation Settings component plays a crucial role in configuring how reservations are managed in the restaurant. By understanding each property's purpose and how it is stored in the data structure, administrators can effectively control the reservation process, ensuring a smooth experience for both the restaurant staff and customers.

---

## References

- **API Endpoints**:
  - Fetch Settings: `GET /api/general-settings`
  - Save Settings: `PUT /api/general-settings`

- **Data Structure Keys**:
  - General Settings: `general-settings`
  - Time Blocks: `timeblocks`
  - Exceptional Days: `exceptionalDays`

- **Dependencies**:
  - React Hooks (`useState`, `useEffect`, `useMemo`)
  - Notification System (`useNotification`)
  - Icon Library (`react-icons`)

---

## Code Snippet

```jsx
// Example of handling input change
const handleChange = (e) => {
  const { name, value } = e.target;
  setSettings((prev) => ({
    ...prev,
    [name]: value,
  }));
};
```

---

# Short Summary

The assistant provided detailed documentation for the General Reservation Settings component, explaining each property, its purpose, data type, input constraints, and where it is stored in the overall data structure. The documentation includes examples from the provided JSON data, describes how the settings interact with the API, and outlines the user interface elements. This helps in understanding how each setting affects the reservation system and where it is located in the data hierarchy.