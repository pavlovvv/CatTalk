import React from "react";
import LanguageIcon from "@mui/icons-material/Language";
import {
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Popover,
} from "@mui/material";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import { GB, RU, UA } from "country-flag-icons/react/3x2";
import Link from "next/link";
import { useTranslation } from "react-i18next";
import { useRouter } from "next/router";
import { useState } from "react";

const LanguageChanger: React.FC = () => {
  const { i18n } = useTranslation();
  const router = useRouter();

  const [anchorLanguageEl, setAnchorLanguageEl] = useState<null | HTMLElement>(
    null
  );

  const handleLanguageClick = (event: any): void => {
    setAnchorLanguageEl(event.currentTarget);
  };

  const handleLanguageClose = (): void => {
    setAnchorLanguageEl(null);
  };

  const languageOpen: boolean = Boolean(anchorLanguageEl);
  const languageId: string | undefined = languageOpen
    ? "simple-language-popover"
    : undefined;

  return (
    <Box>
      <IconButton
        size="large"
        color="inherit"
        onClick={(e) => {
          handleLanguageClick(e);
        }}
      >
        <LanguageIcon sx={{ minWidth: "24px" }} />
      </IconButton>
      <Popover
        id={languageId}
        open={languageOpen}
        anchorEl={anchorLanguageEl}
        onClose={handleLanguageClose}
        disableAutoFocus
        disableEnforceFocus
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "center",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "center",
        }}
        PaperProps={{
          sx: {
            backgroundColor: "#333C83",
            color: "#fff",
          },
        }}
      >
        <Box sx={{ p: 2 }}>
          <List>
            <Link
              href={
                router.pathname !== "/profile/[id]" &&
                router.pathname !== "/chat/join/[token]"
                  ? { pathname: router.pathname }
                  : (router.pathname.includes("[id]") && {
                      pathname: "/profile/[id]/",
                      query: { id: router.query.id },
                    }) ||
                    (router.pathname.includes("[token]") && {
                      pathname: "/chat/join/[token]/",
                      query: { token: router.query.token },
                    })
              }
              locale="en"
            >
              <ListItemButton disabled={i18n.language === "en"}>
                <ListItemIcon>
                  <GB title="United States" style={{ width: "30px" }} />
                </ListItemIcon>
                <ListItemText primary="English (recommended)" />
              </ListItemButton>
            </Link>
            <Link
              href={
                router.pathname !== "/profile/[id]" &&
                router.pathname !== "/chat/join/[token]"
                  ? { pathname: router.pathname }
                  : (router.pathname.includes("[id]") && {
                      pathname: "/profile/[id]/",
                      query: { id: router.query.id },
                    }) ||
                    (router.pathname.includes("[token]") && {
                      pathname: "/chat/join/[token]/",
                      query: { token: router.query.token },
                    })
              }
              locale="ua"
            >
              <ListItemButton disabled={i18n.language === "ua"}>
                <ListItemIcon>
                  <UA title="Ukraine" style={{ width: "30px" }} />
                </ListItemIcon>
                <ListItemText primary="Українська" />
              </ListItemButton>
            </Link>
            <Link
              href={
                router.pathname !== "/profile/[id]" &&
                router.pathname !== "/chat/join/[token]"
                  ? { pathname: router.pathname }
                  : (router.pathname.includes("[id]") && {
                      pathname: "/profile/[id]/",
                      query: { id: router.query.id },
                    }) ||
                    (router.pathname.includes("[token]") && {
                      pathname: "/chat/join/[token]/",
                      query: { token: router.query.token },
                    })
              }
              locale="ru"
            >
              <ListItemButton disabled={i18n.language === "ru"}>
                <ListItemIcon>
                  <RU title="Russia" style={{ width: "30px" }} />
                </ListItemIcon>
                <ListItemText primary="Русский" />
              </ListItemButton>
            </Link>
          </List>
        </Box>
      </Popover>
    </Box>
  );
};

export default LanguageChanger;
