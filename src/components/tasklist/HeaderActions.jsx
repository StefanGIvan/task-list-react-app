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
}) {
  return (
    <section className="card tasklist-actions">
      <div className="header-actions">
        {/*label for select all checkbox*/}
        <label>
          <input
            type="checkbox"
            class="header-checkbox"
            disabled={totalCount === 0}
            checked={isAllChecked}
            onChange={(event) => onToggleSelectAll(event.target.checked)}
          />
          <span className="header-info">
            Selected: {selectedCount}/{totalCount}
          </span>
        </label>

        <div className="header-buttons">
          {/*Bulk Complete Button*/}
          <button
            type="button"
            className="bulk-complete-button"
            disabled={totalCount === 0}
            onClick={onCompleteSelected}
          >
            <BulkCompleteIcon className="bulk-complete-icon" />
          </button>

          {/*Bulk Delete Button*/}
          <button
            type="button"
            className="bulk-delete-button"
            disabled={totalCount === 0}
            onClick={onDeleteSelected}
          >
            <BulkDeleteIcon className="bulk-delete-icon" />
          </button>
        </div>
      </div>
    </section>
  );
}
