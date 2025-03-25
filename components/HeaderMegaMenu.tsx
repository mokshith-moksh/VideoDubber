"use client";
import { Container, Group } from "@mantine/core";
import classes from "../styles/HeaderMegaMenu.module.css";
import { Button } from "@mantine/core";

export function HeaderSimple() {
  return (
    <header className={classes.header}>
      <Container size="md" className={classes.inner}>
        <h2>ColorCord</h2>
        <Group>
          <Button>Github</Button>
          <Button>Discord</Button>
        </Group>
      </Container>
    </header>
  );
}
