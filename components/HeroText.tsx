import { Container, Text, Title } from "@mantine/core";
import { Dots } from "./Dots";
import classes from "../styles/HeroText.module.css";
import DiscordTextGenerator from "./DiscordTextGenerator";

export function HeroText() {
  return (
    <Container className={classes.wrapper} size={1400} mt={-100}>
      <Dots className={classes.dots} style={{ left: 0, top: 0 }} />
      <Dots className={classes.dots} style={{ left: 60, top: 0 }} />
      <Dots className={classes.dots} style={{ left: 0, top: 140 }} />
      <Dots className={classes.dots} style={{ right: 0, top: 60 }} />

      <div className={classes.inner}>
        <Title className={classes.title}>
          Discord{" "}
          <Text component="span" className={classes.highlight} inherit>
            Colored
          </Text>{" "}
          Text Generator
        </Title>

        <Container p={0} size={600}>
          <Text size="lg" c="dimmed" className={classes.description}>
            This app creates colored Discord messages using ANSI codes. Select
            text and click a color to apply, then copy it to send in Discord.
            Fast , easy and free.
          </Text>
        </Container>
        <Container p={0} size={800} h={400}>
          <DiscordTextGenerator />
        </Container>
      </div>
    </Container>
  );
}
