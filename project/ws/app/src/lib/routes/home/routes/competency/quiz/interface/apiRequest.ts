
import { NSContent } from './content'

export const CONTENT_BASE_STATIC = '/artifacts'
export const CONTENT_BASE_STREAM = '/assets'
export const CONTENT_BASE_WEBHOST = '/web-hosted'
export const CONTENT_BASE_WEBHOST_ASSETS = '/web-hosted/assets'
export namespace NSApiRequest {
  export interface ICreateMetaRequestGeneral {
    name: string
    description: string
    mimeType: string
    contentType: string
    resourceType?: string
    isTranslationOf?: string
    locale?: string
    isExternal?: boolean
  }

  export interface ICreateMetaRequestGeneralV2 {
    name: string
    description: string
    mimeType: string
    contentType: string
    resourceType?: string
    isTranslationOf?: string
    locale?: string
    isExternal?: boolean
    primaryCategory: string
    purpose: string
    license?: string
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

  export interface ICreateMetaRequestV2 {
    request: {
      content: {
        name: string
        code: string
        description: string
        createdBy: string
        organisation: string[]
        createdFor: string[]
        contentType: string
        framework: string
        mimeType: string
        creator?: string
        primaryCategory: string
        isExternal: boolean
        license: string
        ownershipType: string[]
        purpose: string
        visibility: string
      }
    }
  }

  export interface ICreateImageMetaRequestV2 {
    request: {
      content: {
        name: string
        code: string
        createdBy: string
        contentType: string
        mimeType: string
        mediaType: string
        organisation?: string[]
        creator?: string
        license: string
        language: string[]
        primaryCategory: string
        generateDIALCodes?: string
        dialcodeRequired?: string
        createdFor?: string[]
      }
    }
  }

  export interface IUpdateImageMetaRequestV2 {
    request: {
      content: {
        // identifier: string
        artifactUrl: string
        // content_url: string
        // node_id: string
        versionKey: string
      }
    }
  }
  export interface IForwardBackwardActionGeneral {
    comment: string
    operation: 1 | 0 | -1 | 100000
  }

  export interface IForwardBackwardAction {
    actor: string
    comment: string
    operation: 1 | 0 | -1 | 100000
    appName: string
    appUrl: string
    rootOrg: string
    org: string
    actorName: string
    action: string
  }

  export interface IContentUpdate {
    nodesModified: {
      [key: string]: {
        isNew: boolean
        root: boolean
        metadata: NSContent.IContentMeta
      }
    }
    hierarchy: {} | { [key: string]: { root: boolean; children: string[] } }
  }

  export interface IContentUpdateV3 {
    request: {
      data: {
        nodesModified: {
          [key: string]: {
            isNew: boolean
            root: boolean
            metadata: NSContent.IContentMeta
          }
        }
        hierarchy: {} | { [key: string]: { root: boolean; children: string[] } }
      }
    }
  }

  export interface ISearchUser {
    request: {
      query: string,
      filters: {
        rootOrgId: string
      }
    }
  }

  export interface ICreateNewUser {
    personalDetails: {
      email: string,
      userName: string,
      firstName: string,
      lastName: string,
      channel: string
    }
  }

  export interface IAssignUserRoles {
    request: {
      organisationId?: string,
      userId: string,
      roles: string[]
    }
  }

  export interface IBlockOrUnblockUser {
    request: {
      userId: string,
      requestedBy?: string
    }
  }

  export interface IContentUpdateV2 {
    request: {
      content: NSContent.IContentMeta
    }
  }

  export interface IContentData {
    contentId: string
    contentType:
    | typeof CONTENT_BASE_STATIC
    | typeof CONTENT_BASE_STREAM
    | typeof CONTENT_BASE_WEBHOST
    | typeof CONTENT_BASE_WEBHOST_ASSETS
  }
}
