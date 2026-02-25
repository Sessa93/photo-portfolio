import {NextRequest, NextResponse} from "next/server";
import {getSession} from "@/lib/session";
import {deletePhoto, updatePhoto} from "@/lib/db";

interface Params {
    params: Promise<{ id: string }>;
}

export async function PUT(req: NextRequest, {params}: Params) {
    const session = await getSession();
    if (!session.isLoggedIn) {
        return NextResponse.json({error: "Unauthorized."}, {status: 401});
    }

    const {id} = await params;
    try {
        const body = await req.json();
        const {title, description, url, camera, lens, settings, location, film, tags, sort_order} = body;

        if (!title || !url) {
            return NextResponse.json({error: "Title and URL are required."}, {status: 400});
        }

        const photo = await updatePhoto(id, {
            title,
            description: description ?? "",
            url,
            camera: camera || null,
            lens: lens || null,
            settings: settings || null,
            location: location || null,
            film: film || null,
            tags: tags || null,
            sort_order: Number(sort_order) || 0,
        });

        if (!photo) {
            return NextResponse.json({error: "Photo not found."}, {status: 404});
        }

        return NextResponse.json(photo);
    } catch (err) {
        console.error("PUT /api/admin/photos/[id] error:", err);
        return NextResponse.json({error: "Database error."}, {status: 500});
    }
}

export async function DELETE(_req: Request, {params}: Params) {
    const session = await getSession();
    if (!session.isLoggedIn) {
        return NextResponse.json({error: "Unauthorized."}, {status: 401});
    }

    const {id} = await params;
    try {
        await deletePhoto(id);
        return NextResponse.json({ok: true});
    } catch (err) {
        console.error("DELETE /api/admin/photos/[id] error:", err);
        return NextResponse.json({error: "Database error."}, {status: 500});
    }
}
