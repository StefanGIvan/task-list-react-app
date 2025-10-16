import "./styles/HeaderActions.css";

//sgv files can be imported directly as components (because of Vite)
import BulkCompleteIcon from "../../assets/icons/bulkComplete.svg?react";

import BulkDeleteIcon from "../../assets/icons/bulkDelete.svg?react";

export default function HeaderActions({
  totalCount,
  selectedCount,
  onCompleteSelected,
  onDeleteSelected,
}) {
  const nothingSelected = selectedCount === 0;

  return (
    <section className="tasklist-card tasklist-actions-card">
      <div className="header-actions">
        <span className="header-info">
          Selected: {selectedCount}/{totalCount}
        </span>

        <div className="header-buttons">
          {/*Bulk Complete Button*/}
          <button
            type="button"
            className="bulk-complete-button"
            disabled={nothingSelected}
            onClick={onCompleteSelected}
          >
            <BulkCompleteIcon className="bulk-complete-icon" />
          </button>

          {/*Bulk Delete Button*/}
          <button
            type="button"
            className="bulk-delete-button"
            disabled={nothingSelected}
            onClick={onDeleteSelected}
          >
            <BulkDeleteIcon className="bulk-delete-icon" />
          </button>
        </div>
      </div>
    </section>
  );
}
