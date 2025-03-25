import "@mantine/core/styles.css";

import {
  ColorSchemeScript,
  MantineProvider,
  mantineHtmlProps,
} from "@mantine/core";
import { HeaderSimple } from "@/components/HeaderMegaMenu";

export const metadata = {
  title: "ColorCord",
  description: "Discord Colored Text Genrator",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" {...mantineHtmlProps}>
      <head>
        <ColorSchemeScript />
      </head>
      <body>
        <MantineProvider>
          <HeaderSimple />
          {children}
        </MantineProvider>
      </body>
    </html>
  );
}
