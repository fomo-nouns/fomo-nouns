import 'package:bloc/bloc.dart';
import 'package:flutter/material.dart';
import 'package:mobileapp/app/colors.dart';
import 'package:mobileapp/screens/play/web_view_play/models/web_data.dart';

extension ThemeColorX on Color {
  bool get isCoolBackground => this == AppColors.coolBackground;
  bool get isWarmBackground => this == AppColors.warmBackground;
}

class ThemeCubit extends Cubit<Color> {
  ThemeCubit() : super(defaultColor);

  static const defaultColor = AppColors.coolBackground;

  void updateTheme(FomoNounsWebData? data) {
    if (data!.toColor != state) {
      emit(data.toColor);
    }
  }

  void resetTheme() {
    emit(defaultColor);
  }
}

extension on FomoNounsWebData {
  Color get toColor {
    switch (background) {
      case NounBackground.cool:
        return AppColors.coolBackground;
      case NounBackground.warm:
        return AppColors.warmBackground;
      default:
        return ThemeCubit.defaultColor;
    }
  }
}
