import { NsContent } from '@sunbird-cb/collection'

export namespace NsMandatoryCourse {
  export interface IEmptyDataDisplay {
    image?: string,
    heading: string,
    description: string,
    btnRequired?: boolean,
    btnLink?: string,
    btnText?: string,
  }

  export interface ICreateMetaRequestV2 {
    request: {
      content: {
        name: string
        code?: string
        description: string
        createdBy?: string
        organisation?: string[]
        createdFor?: string[]
        contentType?: string
        framework?: string
        mimeType: string
        creator?: string
        primaryCategory: string
        isExternal: boolean
        license?: string
        ownershipType?: string[]
        purpose?: string
        visibility?: string
      }
    }
  }

  export interface ICreateMetaRequest {
    content: {
      name: string
      description: string
      mimeType: string
      contentType: string
      createdBy: string
      resourceType?: string
      locale: string
      authoringDisabled?: boolean
      isMetaEditingDisabled?: boolean
      isContentEditingDisabled?: boolean
      isExternal?: boolean
      categoryType?: string
      accessPaths?: string
      category?: string
    }
  }

  export interface IContentCreateResponse {
    identifier: string
  }

  export interface IContentCreateResponseV2 {
    id?: string
    ver?: string
    ts?: string
    params?: {
      resmsgid?: string
      msgid?: string,
      err?: string,
      status?: string
      errmsg?: string
    },
    responseCode?: string
    result: {
      identifier: string
      node_id: string
      versionKey: string
    }
  }

  export interface IContentUpdateV3 {
    request: {
      data: {
        nodesModified: {
          [key: string]: {
            isNew: boolean
            root: boolean
            metadata: NsContent.IContent
          }
        }
        hierarchy: {} | { [key: string]: { root: boolean; children: string[] } }
      }
    }
  }
}
