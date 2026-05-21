import React from "react";
import PropTypes from "prop-types";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import FolderOpenIcon from "@mui/icons-material/FolderOpenSharp";
import { useTranslation } from "react-i18next";

/**
 * CollectionInfo plugin — replaces the default Mirador "Collection" section
 * in the info panel.
 *
 * Props provided by Mirador:
 *   - collectionLabel  {string|null}   Human-readable title of the parent collection
 *   - collectionPath   {string[]}      Array of manifest IDs forming the collection path
 *   - showCollectionDialog {function}  Opens the collection browser dialog
 *   - windowId         {string}        The current Mirador window ID
 */
export const CollectionInfoPlugin = ({
  collectionLabel = null,
  collectionPath = [],
  showCollectionDialog,
  windowId = null,
}) => {
  const { t } = useTranslation();

  // Don't render if there's no collection context.
  if (collectionPath.length === 0) return null;

  const openCollectionDialog = () => {
    const manifestId = collectionPath[collectionPath.length - 1];
    showCollectionDialog(manifestId, collectionPath.slice(0, -1), windowId);
  };

  return (
    <Box
      sx={{
        borderTop: "0.5px solid rgba(255,255,255,0.15)",
        mt: 2,
        pt: 2,
        px: 1,
      }}
    >
      <Typography variant="overline" display="block" gutterBottom>
        {t("collection")}
      </Typography>

      {collectionLabel && (
        <Typography variant="h4" gutterBottom>
          {collectionLabel}
        </Typography>
      )}

      <Button
        color="primary"
        onClick={openCollectionDialog}
        startIcon={<FolderOpenIcon />}
        size="small"
      >
        {t("showCollection")}
      </Button>
    </Box>
  );
};

CollectionInfoPlugin.propTypes = {
  collectionLabel: PropTypes.string,
  collectionPath: PropTypes.arrayOf(PropTypes.string),
  showCollectionDialog: PropTypes.func.isRequired,
  windowId: PropTypes.string,
};
