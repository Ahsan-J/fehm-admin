import Document, { Html, Head, Main, NextScript } from 'next/document'
import { StyleSheetServer } from 'aphrodite'
import { DocumentContext } from 'next/dist/shared/lib/utils'

class MyDocument extends Document<any> {
  static async getInitialProps(ctx: DocumentContext) {
    const { html, css }: {[key: string]: any} = StyleSheetServer.renderStatic(() =>  ctx.renderPage() as any)
    const ids = css.renderedClassNames
    return { ...html, css, ids }
  }

  render() {
    const { css, ids } = this.props
    return (
      <Html>
        <Head>
          <style
            data-aphrodite
            dangerouslySetInnerHTML={{ __html: css.content }}
          />
          <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@4.5.3/dist/css/bootstrap.min.css" integrity="sha384-TX8t27EcRE3e/ihU7zmQxVncDAy5uIKz4rEkgIXeMed4M0jlfIDPvg6uqKI2xXr2" crossOrigin="anonymous"></link>
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