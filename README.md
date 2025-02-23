# Task Management System

A task management system built with a focus on efficiency.

## Overview
This project provides an intuitive task management solution that allows users to create, edit, delete and manage tasks. users can also filter, sort. It also supports bulk operations for editing and deleting multiple tasks at once

## Assumptions & Design Decisions
- **State Management**: The system stores the tasks locally in the localstorage. upon fetching for the first time, the payload is cached and reused until a hard refresh happens. The only otter time the data is fetched from the localstorage is when an item is deleted. During the lifetime of the system the state is managed by separate context providers. For example, state to do with the user interface is manage by the UiContext provider and state to do with managing task is managed by the TaskContext. 
- **Optimized Filtering & Sorting**: Tasks can be filtered based on constraints without affecting sorting providing more power in search capabilities.

- **Undo & Redo Functionality**: Users can revert accidental changes or redo actions to maintain workflow consistency as long as a hard refresh does not occur.

- **Snapshot Saving for Drag-and-Drop**: The system captures board state snapshots before any drag-and-drop operation. The snapshots are save in the localStorage allowing the user to pick up exactly where they left on.
- **Dynamic Column Management**: Users can modify task fields dynamically, adding or removing columns as needed.


## Running Locally
To run the project locally, clone this repository. Then run

```sh
npm install
npm run dev
```

Your application should now be running on `http://localhost:3000`. 

---
