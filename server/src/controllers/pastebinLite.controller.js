import PastebinLite from "../models/pastebinLite.model.js";

export const getHealthz = async (req, res) => {
  try {
    return res.status(200).json({ ok: true });
  } catch (error) {
    return res.status(500).json({ ok: false, message: error.message });
  }
};

export const postPastes = async (req, res) => {
  try {
    const { content, ttl_seconds, max_views } = req.body;
    content.trim();
    if (!content) {
      return res
        .status(400)
        .json({ ok: false, message: "Content is required" });
    }

    const newPaste = new PastebinLite({
      content,
      ttl_seconds: ttl_seconds || 1,
      max_views: max_views || 1,
    });

    await newPaste.save();
    console.log(process.env.APP_URL);
    return res.status(201).json({
      id: newPaste._id,
      url: `${process.env.APP_URL}/p/${newPaste._id}`,
    });
  } catch (error) {
    return res.status(500).json({ ok: false, message: error.message });
  }
};

export const getPastes = async (req, res) => {
  try {
    const { id } = req.params;
    const paste = await PastebinLite.findById(id);
    if (!paste) {
      return res.status(404).json({ ok: false, message: "Paste not found" });
    }
    const expires_at = paste.createdAt.getTime() + paste.ttl_seconds * 1000;
    console.log({ expires_at, now: Date.now() });
    if (paste.ttl_seconds && expires_at < Date.now()) {
      return res.status(404).json({ message: "Paste expired" });
    }

    const remaining_views = paste.max_views - paste.views;
    if (remaining_views !== null) {
      if (remaining_views <= 0) {
        await PastebinLite.deleteOne({ _id: id });
        return res.status(404).json({ message: "Paste no longer available" });
      }
      paste.views += 1;
      await paste.save();
    }
    console.log(paste);

    return res.status(200).json({
      content: paste.content,
      remaining_views: paste.max_views - paste.views,
      expores_at: new Date(
        paste.createdAt.getTime() + paste.ttl_seconds * 1000
      ),
    });
  } catch (error) {
    return res.status(500).json({ ok: false, message: error.message });
  }
};

export const getHTMLPastes = async (req, res) => {
  try {
    const paste = await PastebinLite.findById(req.params.id);
    if (!paste) return res.status(404).send("Not found");

    paste.views += 1;
    await paste.save();
    console.log(paste);

    res.set("Content-Type", "text/html");
    res.send(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Paste View</title>
          <style>
            body {
              font-family: Arial, 
              sans-serif;
              margin: 40px;
              background-color: #f9f9f9; 
            }
            .container { 
            max-width: 600px;
             margin: 50px auto;
              padding: 20px;
              background: white; 
              box-shadow: 0 2px 8px rgba(0,0,0,0.1);
            }
            h1 { 
              color: #333;
            }
            p {
             line-height: 1.6; 
            }
          </style>
        </head>
        <body>
          <div class="container">
            <h1>Your Paste</h1>
            <pre><code>${escapeHtml(paste.content)}</code></pre>
            
            
          </div>
        </body>
      </html>
    `);
  } catch (error) {
    return res.status(500).json({ ok: false, message: error.message });
  }
};

// HTML SAFE VIEW
function escapeHtml(str) {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

