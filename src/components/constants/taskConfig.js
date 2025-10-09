//Useful later, when components will use taskConfig.jsx for sorting and filtering
export const CATEGORY_MAPPING = {
  low: {
    label: "Low Priority",
    priority: 0,
  },
  medium: {
    label: "Medium Priority",
    priority: 1,
  },
  high: {
    label: "High Priority",
    priority: 2,
  },
};

export const SORT_OPTIONS = {
  "date-asc": "Oldest first",
  "date-desc": "Newest first",
  "priority-asc": "Low -> High",
  "priority-desc": "High -> Low",
};
