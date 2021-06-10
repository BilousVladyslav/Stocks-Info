from rest_framework import serializers

from .models import Product


class ProductsSerializer(serializers.ModelSerializer):
    class Meta:
        model = Product
        fields = "__all__"


class ProductDataSerializer(serializers.ModelSerializer):
    history = serializers.SerializerMethodField(read_only=True)
    info = serializers.SerializerMethodField(read_only=True)
    last_recommendations = serializers.SerializerMethodField(read_only=True)

    def get_history(self, obj):
        return obj.history(period='1y')

    def get_info(self, obj):
        return obj.info()

    def get_last_recommendations(self, obj):
        return obj.last_recommendations()[-1]

    class Meta:
        model = Product
        fields = "__all__"
