
import { google } from "googleapis"
import { getToken } from 'next-auth/jwt';
import { GetServerSideProps } from 'next';

type File = {
  id: string,
  name: string,
  mimeType: string,
  parents: string[]
}

type ServerSideProps = {
  exists: boolean,
  files: File[]
  folderName: string,
  parentFolderId: string,
  folderId: string
}

export const getServerSideProps: GetServerSideProps = async(context) => {
  const token = await getToken({ req: context.req })

  const oauth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_ID,
    process.env.GOOGLE_SECRET
  );

  oauth2Client.setCredentials({
    access_token: token!.accessToken
  });

  const drive = google.drive({ version: 'v3', auth: oauth2Client });
  const files: File[] = []
  let folderName = ""
  let parentFolderId = "root"

  try {
    const {
      data: {
        name,
        mimeType,
        parents,
      }
    } = await drive.files.get({
      fileId: context.query.id as string,
      fields: 'name, mimeType, parents'
    })

    console.log(parents)
    
    if (mimeType !== 'application/vnd.google-apps.folder') {
      throw new Error("Not a folder")
    }

    folderName = name!
    if (parents) {
      parentFolderId = parents[0]!
    }
  } catch (err) {

    return {
      props: {
        exists: false,
        folderName: "",
        files: [],
        parentFolderId: "",
        folderId: ""
      }
    }
  }

  let incompleteSearch = true
  let nextPageToken: string | undefined
  let iteration = 0
  
  while (incompleteSearch && iteration < 3) {
    iteration++
    try {
      const {
        data: {
          files: filesData,
          nextPageToken: nextPageTokenData
        }
      } = await drive.files.list({
        pageSize: 15,
        fields: 'nextPageToken, files(id, name, mimeType, parents)',
        q: `'${context.query.id}' in parents and trashed = false and mimeType = 'application/vnd.google-apps.folder'`,
        pageToken: nextPageToken
      })
  
      if (filesData) {
        files.push(...filesData as File[])
      }
      
      nextPageToken = nextPageTokenData!
      if (nextPageToken) {
        incompleteSearch = true
      } else {
        incompleteSearch = false
      }
    } catch (err) {
      incompleteSearch = false
    }
  }

  return {
    props: {
      files,
      folderName,
      exists: true,
      parentFolderId,
      folderId: context.query.id
    }
  };
}

export default function(props: ServerSideProps) {
  const { exists, files, folderName, parentFolderId, folderId } = props

  if (!exists) {
    return (
      <>
        <h1> Folder not found </h1>
        <a href="/folder/root">Back</a>
      </>
    )
  }

  return (
    <>
        <h1> Folder "{folderName}" </h1>
        <a href={`/folder/${parentFolderId}`}>Back</a>

        <ul>
          {files.map((file) => (
            <li key={file.id}>
              <a href={`/folder/${file.id}`}>{file.name}</a>
            </li>
          ))}
        </ul>

        {/* Add centered button, redirect to /driveshow/<id> with text DRIVESHOW!! */}
        <a 
          href={`/driveshow/${folderId}`}
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "100px",
            width: "200px",
            backgroundColor: "blue",
            color: "white",
            borderRadius: "10px",
            fontSize: "20px",
            fontWeight: "bold",
            textDecoration: "none"
          }}
        >DRIVESHOW!!</a>
    </>
  )
}
