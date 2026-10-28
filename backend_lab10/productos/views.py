from django.http import JsonResponse, HttpResponse
from django.views.decorators.csrf import csrf_exempt
import json

PRODUCTOS = [
    {"codigo": 1, "descripcion": "Coca cola", "precio": 2.33},
    {"codigo": 2, "descripcion": "Fanta", "precio": 1.70}
]

@csrf_exempt
def lista_productos(request):
    # Permite peticiones de verificación previa del navegador (preflight OPTIONS)
    if request.method == 'OPTIONS':
        response = HttpResponse()
        response["Access-Control-Allow-Origin"] = "*"
        response["Access-Control-Allow-Methods"] = "GET, POST, OPTIONS"
        response["Access-Control-Allow-Headers"] = "Content-Type"
        return response

    if request.method == 'GET':
        response = JsonResponse(PRODUCTOS, safe=False)
        response["Access-Control-Allow-Origin"] = "*"
        return response

    elif request.method == 'POST':
        try:
            datos = json.loads(request.body)
            nuevo_producto = {
                "codigo": len(PRODUCTOS) + 1,
                "descripcion": datos.get("descripcion"),
                "precio": float(datos.get("precio"))
            }
            PRODUCTOS.append(nuevo_producto)
            
            response = JsonResponse(nuevo_producto, status=201)
            response["Access-Control-Allow-Origin"] = "*"
            response["Access-Control-Allow-Headers"] = "Content-Type"
            return response
        except Exception as e:
            response = JsonResponse({"error": str(e)}, status=400)
            response["Access-Control-Allow-Origin"] = "*"
            return response