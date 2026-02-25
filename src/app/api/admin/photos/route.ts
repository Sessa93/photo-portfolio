import {NextRequest, NextResponse} from "next/server";
import {getSession} from "@/lib/session";
import {getPhotos, insertPhoto} from "@/lib/db";

function slugify(title: string): string {
    return (
        title
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/(^-|-$)/g, "") +
        "-" +
        Date.now().toString(36)
    );
}

async function requireAuth() {
    const session = await getSession();
    if (!session.isLoggedIn) {
        return NextResponse.json({error: "Unauthorized."}, {status: 401});
    }
    return null;
}

export async function GET() {
    const denied = await requireAuth();
    if (denied) return denied;

    try {
        const photos = await getPhotos();
        return NextResponse.json(photos);
    } catch (err) {
        console.error("GET /api/admin/photos error:", err);
        return NextResponse.json({error: "Database error."}, {status: 500});
    }
}

export async function POST(req: NextRequest) {
    const denied = await requireAuth();
    if (denied) return denied;

    try {
        const body = await req.json();
        const {title, description, url, camera, lens, settings, location, film, sort_order} = body;

        if (!title || !url) {
            return NextResponse.json({error: "Title and URL are required."}, {status: 400});
        }

        const id = slugify(title);
        const photo = await insertPhoto({
            id,
            title,
            description: description ?? "",
            url,
            camera: camera || null,
            lens: lens || null,
            settings: settings || null,
            location: location || null,
            film: film || null,
            sort_order: Number(sort_order) || 0,
        });

        return NextResponse.json(photo, {status: 201});
    } catch (err) {
        console.error("POST /api/admin/photos error:", err);
        return NextResponse.json({error: "Database error."}, {status: 500});
    }
}
