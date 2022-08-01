import {
    Avatar,
    Box
} from "@mui/material";
import Collapse from "@mui/material/Collapse";
import IconButton from "@mui/material/IconButton";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import KeyboardArrowUp from "@mui/icons-material/KeyboardArrowUp";
import KeyboardArrowDown from "@mui/icons-material/KeyboardArrowDown";
import Image from "next/image";
import Link from "next/link";
import * as React from "react";
import { useState } from "react";
import {
  IOtherTranslation,
    IStringAvatar
} from "../../typescript/interfaces/data";
import { IRowProps } from "../../typescript/interfaces/data";
import setTranslation from "../../other/locales/setTranslation";
import { useRouter } from "next/router";


export default function Row(props: IRowProps){
    const { row } = props;
    const [open, setOpen] = useState<boolean>(false);

    const {locale} = useRouter()

    const t: IOtherTranslation = setTranslation(locale as string)
  
    const stringAvatar = (name: string): IStringAvatar => {
      return {
        children: `${name.split(" ")[0][0]}${name.split(" ")[1][0]}`,
      };
    };
    return (
      <>
        <TableRow
          sx={{
            "& > *": { borderBottom: "unset" },
            display: "flex",
            justifyContent: "flex-start",
          }}
        >
          <TableCell sx={{ marginBottom: 0 }}>
            <IconButton
              aria-label="expand row"
              size="small"
              onClick={() => setOpen(!open)}
            >
              {open ? <KeyboardArrowUp /> : <KeyboardArrowDown />}
            </IconButton>
          </TableCell>
          <TableCell
            component="th"
            scope="row"
            sx={{
              display: "flex",
              alignItems: "center",
              columnGap: "20px",
              fontFamily: "Quicksand",
              width: "100%",
            }}
          >
            <Link href={`/profile/${row.id}`} passHref>
              <a target="_blank" rel="noopener noreferrer">
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    marginBottom: "-1px",
                    columnGap: "20px",
                    fontFamily: "Quicksand",
                  }}
                >
                  {row.avatar_url ? (
                    <Image
                      width="40px"
                      height="40px"
                      style={{ borderRadius: "50%" }}
                      src={row.avatar_url}
                      alt="content__img"
                    />
                  ) : (
                    <Avatar
                      {...stringAvatar(row.name + " " + row.surname)}
                      sx={{
                        bgcolor: "#fff",
                        width: "40px",
                        height: "40px",
                        fontSize: "15px",
                      }}
                    />
                  )}
                  {row.username}
                </Box>
              </a>
            </Link>
          </TableCell>
        </TableRow>
        <TableRow>
          <TableCell style={{ paddingBottom: 0, paddingTop: 0, paddingLeft: 0 }} colSpan={6}>
            <Collapse in={open} timeout="auto" unmountOnExit>
              <Box sx={{ margin: 1 }}>
                <Table size="small" aria-label="purchases">
                  <TableHead>
                    <TableRow>
                      <TableCell sx={{ fontWeight: 900 }}>{t.total_chats}</TableCell>
                      <TableCell sx={{ fontWeight: 900 }}>
                      {t.total_messages_sent}
                      </TableCell>
                      <TableCell sx={{ fontWeight: 900 }}>
                      {t.total_entered_characters}
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    <TableRow
                      sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                    >
                      <TableCell
                        component="th"
                        scope="row"
                        sx={{ fontFamily: "Quicksand" }}
                      >
                        {row.stats.totalChats}
                      </TableCell>
                      <TableCell sx={{ fontFamily: "Quicksand" }}>
                        {row.stats.totalMessagesSent}
                      </TableCell>
                      <TableCell sx={{ fontFamily: "Quicksand" }}>
                        {row.stats.totalCharactersEntered}
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </Box>
            </Collapse>
          </TableCell>
        </TableRow>
      </>
    );
  };