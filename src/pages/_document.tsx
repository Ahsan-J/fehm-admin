import Document, { Html, Head, Main, NextScript } from 'next/document'
import { StyleSheetServer } from 'aphrodite'
import { DocumentContext } from 'next/dist/shared/lib/utils'

class MyDocument extends Document<any> {
  static async getInitialProps(ctx: DocumentContext) {
    const { html, css }: { [key: string]: any } = StyleSheetServer.renderStatic(() => ctx.renderPage() as any)
    const ids = css.renderedClassNames
    return { ...html, css, ids }
  }

  render() {
    const { css, ids } = this.props
    return (
      <Html>
        <Head>
          <title>{process.env.NEXT_PUBLIC_APP_NAME} | Admin</title>
          <style
            data-aphrodite
            dangerouslySetInnerHTML={{ __html: css.content }}
          />
          {/* eslint-disable-next-line @next/next/no-css-tags */}
          <link rel="stylesheet" href="/bootstrap.min.css"></link>
        </Head>
        <body>
          <Main />
          <NextScript />
          {ids && (
            <script
              dangerouslySetInnerHTML={{
                __html: `
                  window.__REHYDRATE_IDS = ${JSON.stringify(ids)}
                `,
              }}
            />
          )}
        </body>
      </Html>
    )
  }
}

export default MyDocument