import "./styles/HeaderActions.css";

//sgv files can be imported directly as components (because of Vite)
import BulkCompleteIcon from "../../assets/icons/bulkComplete.svg?react";

import BulkDeleteIcon from "../../assets/icons/bulkDelete.svg?react";

export default function HeaderActions({
  totalCount,
  selectedCount,
  onCompleteSelected,
  onDeleteSelected,
  onToggleSelectAll,
  isAllChecked,
  sortMode, //current sorting method
  onSortModeChange, //changed sorting method
}) {
  return (
    <section className="card tasklist-actions">
      <div className="header-actions">
        {/*label for select all checkbox*/}
        <label className="header-actions-label">
          <input
            type="checkbox"
            className="header-checkbox"
            disabled={totalCount === 0}
            checked={isAllChecked}
            onChange={(event) => onToggleSelectAll(event.target.checked)}
          />
          <span className="header-info">
            Selected: {selectedCount}/{totalCount}
          </span>
        </label>

        <select
          className="header-select"
          value={sortMode}
          onChange={(event) => onSortModeChange(event.target.value)}
        >
          <option value="none">None</option>
          <option value="date-asc">Date: New→Old</option>
          <option value="date-desc">Date: Old→New</option>
          <option value="priority-asc">Priority: Low→High</option>
          <option value="priority-desc">Priority: HIgh→Low</option>
        </select>

        <div className="header-buttons">
          {/*Bulk Complete Button*/}
          <button
            type="button"
            className="bulk-complete-button"
            disabled={selectedCount === 0}
            onClick={onCompleteSelected}
          >
            <BulkCompleteIcon className="bulk-complete-icon" />
          </button>

          {/*Bulk Delete Button*/}
          <button
            type="button"
            className="bulk-delete-button"
            disabled={selectedCount === 0}
            onClick={onDeleteSelected}
          >
            <BulkDeleteIcon className="bulk-delete-icon" />
          </button>
        </div>
      </div>
    </section>
  );
}
