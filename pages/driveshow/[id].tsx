
import { google } from "googleapis"
import { getToken } from 'next-auth/jwt';
import { GetServerSideProps } from 'next';
import { useEffect, useState } from "react";
import BootstrapCarousel from "../../components/Bootstrap";

type File = {
  id: string,
  name: string,
  mimeType: string,
  parents: string[],
  webContentLink: string
}

type ServerSideProps = {
  exists: boolean,
  files: File[]
  folderName: string,
  parentFolderId: string
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
        parentFolderId: ""
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
        fields: 'nextPageToken, files(id, name, mimeType, parents, webContentLink)',
        q: `'${context.query.id}' in parents and trashed = false`,
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
      parentFolderId
    }
  };
}

export default function(props: ServerSideProps) {
  const { exists, files, folderName, parentFolderId } = props

  const [currentFile, setCurrentFile] = useState<File | null>(null)
  const [idx, setIdx] = useState<number>(0)

  useEffect(() => {
    setInterval(() => {
        console.log("called!", idx % files.length)
        setCurrentFile(files[idx % files.length])
        setIdx(idx + 1)
    }, 2000)
  }, [])

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
        {/* <div
            style={{
                background: `url(${currentFile?.webContentLink})`,
                width: "700px",
                height: "700px",
            }}
        >
            ciao
        </div> */}

        <BootstrapCarousel 
            items={(files || []).map(file => ({ imageUrl: file.webContentLink }) )}
        />
    </>
  )
}
